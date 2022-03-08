import { MyContext } from "src/types";
import { Comment } from "../entities/Comment";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { User } from "../entities/User";

@InputType()
class CommentInput {
  @Field()
  text: string;
  @Field()
  postId: number;
}

@ObjectType()
class Comments {
  @Field(() => [Comment])
  comments: Comment[];
}

@Resolver(Comment)
export class CommentResolver {
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
    return { comments };
  }

  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  async addComment(
    @Arg("input") input: CommentInput,
    @Ctx() { req }: MyContext
  ): Promise<Comment> {
    return Comment.create({
      ...input,
      userId: req.session.userId,
    }).save();
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
    if (user?.role !== "admin" && comment.userId !== req.session.userId) {
      throw new Error("not authorized");
    }

    await Comment.delete({ id });
    return true;
  }
}
