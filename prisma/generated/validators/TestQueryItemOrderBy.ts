import { type } from "arktype";

export const TestQueryItemOrderBy = type({
  "id?": "'asc' | 'desc'",
  "name?": "'asc' | 'desc'",
  "value?": "'asc' | 'desc'",
  "modelId?": "'asc' | 'desc'",
});
