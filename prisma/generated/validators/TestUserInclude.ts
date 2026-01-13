import { type } from "arktype";

export const TestUserInclude = type({
  "posts?": "boolean",
  "profile?": "boolean",
  "metadata?": "boolean",
  "_count?": "boolean",
});
