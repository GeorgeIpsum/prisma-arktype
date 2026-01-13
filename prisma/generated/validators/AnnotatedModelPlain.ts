import { type } from "arktype";

export const AnnotatedModelPlain = type({
  "id?": "string",
  computedField: "string",
  updateOnlyField: "string",
  createOnlyField: "string",
  email: "string.email",
  "website?": "string.url | null",
  normalField: "string",
  "description?": "string | null",
  "createdAt?": "Date",
  updatedAt: "Date",
});
