import { type } from "arktype";

export const TestQueryModelOrderBy = type({
  "id?": "'asc' | 'desc'",
  "title?": "'asc' | 'desc'",
  "subtitle?": "'asc' | 'desc'",
  "priority?": "'asc' | 'desc'",
  "score?": "'asc' | 'desc'",
  "isActive?": "'asc' | 'desc'",
  "createdAt?": "'asc' | 'desc'",
  "updatedAt?": "'asc' | 'desc'",
});
