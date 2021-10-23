import { Query } from "type-graphql";

export class HelloResolver {
  @Query(() => String)
  hello() {
    return "hello world";
  }
}
