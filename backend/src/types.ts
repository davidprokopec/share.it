import { Session } from "express-session";
import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: Session };
  res: Response;
};
declare module "express-session" {
  interface Session {
    userId: number;
  }
}
