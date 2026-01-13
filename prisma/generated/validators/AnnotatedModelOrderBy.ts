import { type } from "arktype";

export const AnnotatedModelOrderBy = type({
  "id?": "'asc' | 'desc'",
  "computedField?": "'asc' | 'desc'",
  "updateOnlyField?": "'asc' | 'desc'",
  "createOnlyField?": "'asc' | 'desc'",
  "email?": "'asc' | 'desc'",
  "website?": "'asc' | 'desc'",
  "normalField?": "'asc' | 'desc'",
  "description?": "'asc' | 'desc'",
  "createdAt?": "'asc' | 'desc'",
  "updatedAt?": "'asc' | 'desc'",
});
