import { type } from "arktype";

export const TestCommentOrderBy = type({
  "id?": "'asc' | 'desc'",
  "content?": "'asc' | 'desc'",
  "postId?": "'asc' | 'desc'",
  "createdAt?": "'asc' | 'desc'",
});
