import { type } from "arktype";

export const TestOptionsModelOrderBy = type({
  "id?": "'asc' | 'desc'",
  "username?": "'asc' | 'desc'",
  "score?": "'asc' | 'desc'",
  "normalField?": "'asc' | 'desc'",
});
