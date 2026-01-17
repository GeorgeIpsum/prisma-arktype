import { type } from "arktype";

export const TestSchemaAnnotationOrderBy = type({
  "id?": "'asc' | 'desc'",
  "inlineJson?": "'asc' | 'desc'",
  "addressJson?": "'asc' | 'desc'",
  "configJson?": "'asc' | 'desc'",
  "emailWithSchema?": "'asc' | 'desc'",
  "items?": "'asc' | 'desc'",
  "metadata?": "'asc' | 'desc'",
});
