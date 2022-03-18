import argon2 from "argon2";
import { getConnection } from "typeorm";
import { User } from "../entities/User";

export const createOwnerUser = async () => {
  const owner = await User.findOne({ where: { role: "owner" } });
  if (!owner) {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        username: process.env.OWNER_USERNAME,
        email: process.env.OWNER_EMAIL,
        password: await argon2.hash(process.env.OWNER_PASSWORD as string),
        role: "owner",
      })
      .execute();
  }
};
