import { Post } from "./../entities/Post";
import {
  Query,
  Arg,
  Mutation,
  Resolver,
  InputType,
  Field,
  Ctx,
  UseMiddleware,
  Int,
  FieldResolver,
  Root,
  ObjectType,
} from "type-graphql";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
import { Upvote } from "../entities/Upvote";
import { User } from "../entities/User";
import { stringify } from "querystring";
import { FieldError } from "./FieldError";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}
@ObjectType()
class CreatePostResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => Post, { nullable: true })
  post?: Post;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}
@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50) + "...";
  }

  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.creatorId);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() post: Post,
    @Ctx() { upvoteLoader, req }: MyContext
  ) {
    if (!req.session.userId) {
      return null;
    }

    const upvote = await upvoteLoader.load({
      postId: post.id,
      userId: req.session.userId,
    });

    return upvote ? upvote.value : null;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const user = await User.findOne(req.session.userId);

    if (user?.banned) {
      throw new Error("zabanovany uzivatel nemuze hlasovat");
    }

    const isUpvote = value !== -1;
    const realValue = isUpvote ? 1 : -1;
    const { userId } = req.session;

    const upvote = await Upvote.findOne({ where: { postId, userId } });

    if (upvote && upvote.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
          update upvote
          set value = $1
          where "postId" = $2 and "userId" = $3
          `,
          [realValue, postId, userId]
        );

        await tm.query(
          `
          update post
          set points = points + $1
          where id = $2;
          `,
          [2 * realValue, postId]
        );
      });
    } else if (!upvote) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
        insert into upvote ("userId", "postId", value)
        values ($1, $2, $3);
          `,
          [userId, postId, realValue]
        );

        await tm.query(
          `
          update post
          set points = points + $1
          where id = $2;
          `,
          [realValue, postId]
        );
      });
    }

    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const replacements: any[] = [realLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await getConnection().query(
      `
    select p.*
    from post p
    ${cursor ? `where p."createdAt" < $2` : ""}
    order by p."createdAt" DESC
    limit $1
    `,
      replacements
    );

    // console.log(posts);

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => [Post])
  async bestPosts(): Promise<Post[]> {
    // return Post.find({ order: { points: "DESC" } });

    return await getConnection().query(
      `
  select p.*
  from post p
  order by p.points DESC
  limit 10
  `
    );
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => CreatePostResponse)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<CreatePostResponse> {
    if (input.title.length > 20) {
      return {
        errors: [
          {
            field: "title",
            message: "Název nesmí být delší než 20 znaků",
          },
        ],
      };
    }

    const post = await Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();

    return { post };
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title") title: string,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    const user = await User.findOne(req.session.userId);
    if (!post) {
      return null;
    }
    if (
      user?.role !== "admin" &&
      user?.role !== "owner" &&
      post.creatorId !== req.session.userId
    ) {
      throw new Error("not authorized");
    }

    const result = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title, text })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: post.creatorId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const post = await Post.findOne(id);
    const user = await User.findOne(req.session.userId);
    if (!post) {
      return false;
    }
    if (
      user?.role !== "admin" &&
      user?.role !== "owner" &&
      post.creatorId !== req.session.userId
    ) {
      throw new Error("not authorized");
    }

    await Post.delete({ id });
    return true;
  }

  @Query(() => [Post])
  async searchPosts(@Arg("query", () => String) query: string) {
    return await getConnection().query(
      `
      select p.*
      from post p
      WHERE p.title ILIKE $1
      order by p."createdAt" DESC
      `,
      ["%" + query + "%"]
    );
  }
}
