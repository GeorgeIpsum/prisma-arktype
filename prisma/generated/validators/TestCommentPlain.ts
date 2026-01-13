import { type } from "arktype";

export const TestCommentPlain = type({
  "id?": "string",
  content: "string",
  postId: "string",
  "createdAt?": "Date",
});
