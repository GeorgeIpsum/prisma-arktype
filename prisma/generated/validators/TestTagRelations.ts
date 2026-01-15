import { type } from "arktype";
import { TestPostPlain } from "./TestPostPlain";
export const TestTagRelations = type({
  posts: TestPostPlain.array(),
});
