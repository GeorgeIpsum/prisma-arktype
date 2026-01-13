import { type } from "arktype";

export const TestPostOrderBy = type({
  "id?": "'asc' | 'desc'",
  "title?": "'asc' | 'desc'",
  "content?": "'asc' | 'desc'",
  "published?": "'asc' | 'desc'",
  "views?": "'asc' | 'desc'",
  "rating?": "'asc' | 'desc'",
  "authorId?": "'asc' | 'desc'",
  "createdAt?": "'asc' | 'desc'",
  "updatedAt?": "'asc' | 'desc'",
});
