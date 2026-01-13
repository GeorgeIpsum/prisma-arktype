import { type } from "arktype";

export const AnnotatedModelWhere = type({
  "id?": "string",
  "computedField?": "string",
  "updateOnlyField?": "string",
  "createOnlyField?": "string",
  "email?": "string.email",
  "website?": "string.url",
  "normalField?": "string",
  "description?": "string",
  "createdAt?": "Date",
  "updatedAt?": "Date",
});
