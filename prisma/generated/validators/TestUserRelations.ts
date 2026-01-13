import { type } from "arktype";

export const TestUserRelations = type({
  posts: type("unknown").array(),
  profile: "unknown | null",
  metadata: type("unknown").array(),
});
