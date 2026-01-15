import { type } from "arktype";
import { TestCommentPlain } from "./TestCommentPlain";
import { TestTagPlain } from "./TestTagPlain";
import { TestUserPlain } from "./TestUserPlain";
export const TestPostRelations = type({
  author: TestUserPlain,
  tags: TestTagPlain.array(),
  comments: TestCommentPlain.array(),
});
