import { type } from "arktype";

export const TestCommentWhere = type({
  "id?": "string",
  "content?": "string",
  "postId?": "string",
  "createdAt?": "Date",
});
