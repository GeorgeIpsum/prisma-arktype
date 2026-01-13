import { type } from "arktype";

export const TestTagOrderBy = type({
  "id?": "'asc' | 'desc'",
  "name?": "'asc' | 'desc'",
});
