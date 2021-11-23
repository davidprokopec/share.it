import { Session } from "express-session";
import { Request, Response } from "express";
import { Redis } from "ioredis";

export type MyContext = {
  req: Request & { session: Session };
  redis: Redis;
  res: Response;
};
declare module "express-session" {
  interface Session {
    userId: number;
  }
}
