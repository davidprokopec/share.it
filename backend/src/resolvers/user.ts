import { validateRegister } from "./../utils/validateRegister";
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX, __prod__ } from "./../constants";
import { User } from "./../entities/User";
import { MyContext } from "./../types";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import argon2 from "argon2";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
import { getConnection } from "typeorm";
import { FieldError } from "./FieldError";
import { isAuth } from "../middleware/isAuth";

@ObjectType()
class BanAdminResponse {
  @Field(() => String, { nullable: false })
  status!: string;
  @Field(() => String, { nullable: true })
  error?: string;
  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    // vlastni email - ukazat email

    if (
      req.session.userId === user.id ||
      req.session.userRole === "admin" ||
      req.session.userRole === "owner"
    ) {
      return user.email;
    }
    // cizi email - neukazat email
    return "";
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 4) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "Heslo musí mit alespoň 4 znaky",
          },
        ],
      };
    }

    const key = FORGOT_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "Vypršela platnost tokenu",
          },
        ],
      };
    }

    const userIdNum = parseInt(userId);
    const user = await User.findOne(userIdNum);

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "Uživatel již neexistuje",
          },
        ],
      };
    }

    await User.update(
      { id: userIdNum },
      {
        password: await argon2.hash(newPassword),
      }
    );

    redis.del(key);

    // log in after changing password
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // email neexistuje
      return true;
    }

    const token = v4();

    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    ); // 3 dny

    const domain = __prod__
      ? "https://www.davidprokopec.me/"
      : "http://localhost:3000";

    await sendEmail(
      email,
      `<a href="${domain}/change-password/${token}">změnit heslo</a>`
    );

    return true;
  }

  // zjisteni prihlaseneho uzivatele
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    return User.findOne(req.session.userId);
  }

  // registrace uzivatele
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username,
          email: options.email,
          password: hashedPassword,
        })
        .returning("*")
        .execute();
      user = result.raw[0];
    } catch (err) {
      // || err.detail.includes("already exists")) {
      // duplicate username error
      if (err.code === "23505") {
        if (err.detail.includes("Key (email)")) {
          return {
            errors: [
              {
                field: "email",
                message: "Již existuje účet s tímto e-mailem",
              },
            ],
          };
        } else {
          return {
            errors: [
              {
                field: "username",
                message: "Jméno již existuje",
              },
            ],
          };
        }
      }
      console.log("message: ", err.message.detail);
    }

    // automaticky prihlasit po registraci
    req.session.userId = user.id;

    return { user };
  }

  // prihlaseni uzivatele
  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "Toto jméno nebo e-mail neexistuje",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Špatné heslo",
          },
        ],
      };
    }

    req.session.userId = user.id;
    req.session.userRole = user.role;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        res.clearCookie(COOKIE_NAME);
        resolve(true);
      })
    );
  }

  @Query(() => User)
  async user(
    @Arg("username", () => String) username: string
  ): Promise<User | undefined> {
    return await User.findOne({ where: { username }, relations: ["posts"] });
  }

  @Mutation(() => BanAdminResponse)
  @UseMiddleware(isAuth)
  async banUser(
    @Arg("username", () => String) username: string,
    @Arg("action", () => String) action: string,
    @Ctx() { req }: MyContext
  ): Promise<BanAdminResponse> {
    if (req.session.userRole !== "admin" && req.session.userRole !== "owner") {
      return {
        status: "error",
        error: "Nejste admin",
      };
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return {
        status: "error",
        error: "Tento uživatel neexistuje.",
      };
    }

    if (user?.role === "owner") {
      return {
        status: "error",
        error: "Nelze zabanovat majitele.",
      };
    }

    let banned = false;

    if (action === "ban") {
      if (user?.banned) {
        return {
          status: "error",
          error: "Uživatel je již zabanovaný.",
        };
      }
      banned = true;
    } else if (action === "unban") {
      if (!user?.banned) {
        return {
          status: "error",
          error: "Uživatel již není zabanovaný.",
        };
      }
      banned = false;
    } else {
      return {
        status: "error",
        error: "neznama akce",
      };
    }

    const result = await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ banned })
      .where("id = :id", {
        id: user.id,
      })
      .returning("*")
      .execute();

    return {
      status: "success",
      user: result.raw[0],
    };
  }

  @Query(() => [User])
  async bannedUsers(): Promise<User[] | undefined> {
    return await User.find({ where: { banned: true } });
  }

  @Mutation(() => BanAdminResponse)
  @UseMiddleware(isAuth)
  async setAdminUser(
    @Arg("username", () => String) username: string,
    @Arg("action", () => String) action: string,
    @Ctx() { req }: MyContext
  ): Promise<BanAdminResponse> {
    if (req.session.userRole !== "owner") {
      return {
        status: "error",
        error: "Nejste hlavní admin.",
      };
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return {
        status: "error",
        error: "Tento uživatel neexistuje.",
      };
    }

    if (user.role === "owner") {
      return {
        status: "error",
        error: "Nelze odebrat role admina hlavnímu adminovi.",
      };
    }

    let role = "user";

    if (action === "add") {
      if (user.role === "admin") {
        return {
          status: "error",
          error: "Uživatel je již admin.",
        };
      }
      role = "admin";
    } else if (action === "remove") {
      if (user.role !== "admin") {
        return {
          status: "error",
          error: "Uživatel již není admin.",
        };
      }
      role = "user";
    } else {
      return {
        status: "error",
        error: "neznama akce",
      };
    }

    const result = await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ role })
      .where("id = :id", {
        id: user.id,
      })
      .returning("*")
      .execute();

    return {
      status: "success",
      user: result.raw[0],
    };
  }

  @Query(() => [User])
  async users(): Promise<User[] | undefined> {
    return await await User.find({ order: { id: "ASC" } });
  }
}
