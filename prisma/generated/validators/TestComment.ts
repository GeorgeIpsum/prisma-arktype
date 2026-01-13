import { type } from "arktype";
import { TestCommentPlain } from "./TestCommentPlain";
import { TestCommentRelations } from "./TestCommentRelations";

export const TestComment = type(() =>
  TestCommentPlain.and(TestCommentRelations),
);
