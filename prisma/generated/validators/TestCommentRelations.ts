import { type } from "arktype";
import { TestPostPlain } from "./TestPostPlain";
export const TestCommentRelations = type({
  post: TestPostPlain,
});
