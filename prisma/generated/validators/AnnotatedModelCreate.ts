import { type } from "arktype";

export const AnnotatedModelCreate = type({
  createOnlyField: "string",
  email: "string.email",
  "website?": "string.url | null",
  normalField: "string",
  "description?": "string | null",
});
