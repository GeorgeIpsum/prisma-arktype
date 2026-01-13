import { type } from "arktype";

export const AnnotatedModelUpdate = type({
  "updateOnlyField?": "string",
  "email?": "string.email",
  "website?": "string.url | null",
  "normalField?": "string",
  "description?": "string | null",
});
