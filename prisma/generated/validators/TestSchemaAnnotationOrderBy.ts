import { type } from "arktype";

export const TestSchemaAnnotationOrderBy = type({
  "id?": "'asc' | 'desc'",
  "inlineJson?": "'asc' | 'desc'",
  "addressJson?": "'asc' | 'desc'",
  "billingAddress?": "'asc' | 'desc'",
  "configJson?": "'asc' | 'desc'",
  "emailWithSchema?": "'asc' | 'desc'",
  "items?": "'asc' | 'desc'",
  "metadata?": "'asc' | 'desc'",
  "age?": "'asc' | 'desc'",
  "isActive?": "'asc' | 'desc'",
  "createdAt?": "'asc' | 'desc'",
});
