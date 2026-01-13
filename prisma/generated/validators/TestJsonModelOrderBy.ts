import { type } from "arktype";

export const TestJsonModelOrderBy = type({
  "id?": "'asc' | 'desc'",
  "metadata?": "'asc' | 'desc'",
  "settings?": "'asc' | 'desc'",
  "data?": "'asc' | 'desc'",
});
