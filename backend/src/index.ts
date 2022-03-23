import argon2 from "argon2";
import { COOKIE_NAME, __prod__ } from "./constants";
import "dotenv-safe/config";
import { UserResolver } from "./resolvers/user";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cors from "cors";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";
import { Upvote } from "./entities/Upvote";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpvoteLoader } from "./utils/createUpvoteLoader";
import { Comment } from "./entities/Comment";
import { CommentResolver } from "./resolvers/comment";
import { createOwnerUser } from "./utils/createOwnerUser";

const main = async () => {
  // sendEmail("bob@bob.com", "hello");
  const conn = await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Upvote, Comment],
  });
  // await conn.runMigrations();

  if (__prod__) {
    createOwnerUser();
  }

  // Post.delete({});

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 roku
        httpOnly: true,
        sameSite: "none",
        secure: __prod__,
        domain: __prod__ ? ".davidprokopec.me" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    introspection: true,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        // options
      }),
    ],
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver, CommentResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      upvoteLoader: createUpvoteLoader(),
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: { origin: process.env.CORS_ORIGIN, credentials: true },
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log("server running on localhost:4000");
  });
};

main();
