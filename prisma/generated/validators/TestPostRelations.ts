import { type } from "arktype";

export const TestPostRelations = type({
  author: "unknown",
  tags: type("unknown").array(),
  comments: type("unknown").array(),
});
