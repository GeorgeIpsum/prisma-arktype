import { type } from "arktype";

export const TestTagRelations = type({
  posts: type("unknown").array(),
});
