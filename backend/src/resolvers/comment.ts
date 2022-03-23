import { MyContext } from "src/types";
import { Comment } from "../entities/Comment";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { User } from "../entities/User";
import { FieldError } from "./FieldError";

@InputType()
class CommentInput {
  @Field()
  text: string;
  @Field()
  postId: number;
}

@ObjectType()
class AddCommentResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => Comment, { nullable: true })
  comment?: Comment;
}

@ObjectType()
class Comments {
  @Field(() => [Comment])
  comments: Comment[];
}

@Resolver(Comment)
export class CommentResolver {
  @FieldResolver(() => User)
  creator(@Root() comment: Comment, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(comment.userId);
  }

  @Query(() => Comment)
  comment(@Arg("id", () => Int) id: number): Promise<Comment | undefined> {
    return Comment.findOne(id, {
      relations: ["user"],
    });
  }

  @Query(() => Comments, { nullable: true })
  async comments(
    @Arg("postId", () => Int) postId: number
  ): Promise<Comments | undefined> {
    const comments = await Comment.find({
      where: { postId: postId },
      relations: ["user"],
    });
    return { comments: comments.reverse() };
  }

  @Mutation(() => AddCommentResponse)
  @UseMiddleware(isAuth)
  async addComment(
    @Arg("input") input: CommentInput,
    @Ctx() { req }: MyContext
  ): Promise<AddCommentResponse> {
    let comment;

    if (input.text.trim().length === 0) {
      return {
        errors: [
          {
            field: "comment",
            message: "Zadejte text!",
          },
        ],
      };
    }

    const result = await Comment.create({
      ...input,
      userId: req.session.userId,
    }).save();

    comment = await Comment.findOne(result.id, {
      relations: ["user"],
    });

    return { comment };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async removeComment(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    const comment = await Comment.findOne(id);
    const user = await User.findOne(req.session.userId);
    if (!comment) {
      return false;
    }
    if (
      user?.role !== "admin" &&
      user?.role !== "owner" &&
      comment.userId !== req.session.userId
    ) {
      throw new Error("not authorized");
    }

    await Comment.delete({ id });
    return true;
  }
}
