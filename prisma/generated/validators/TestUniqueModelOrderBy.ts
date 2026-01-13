import { type } from "arktype";

export const TestUniqueModelOrderBy = type({
  "id?": "'asc' | 'desc'",
  "email?": "'asc' | 'desc'",
  "username?": "'asc' | 'desc'",
  "slug?": "'asc' | 'desc'",
  "category?": "'asc' | 'desc'",
});
