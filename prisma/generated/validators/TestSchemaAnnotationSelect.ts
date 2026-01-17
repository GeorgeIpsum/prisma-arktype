import { type } from "arktype";

export const TestSchemaAnnotationSelect = type({
  "id?": "boolean",
  "inlineJson?": "boolean",
  "addressJson?": "boolean",
  "configJson?": "boolean",
  "emailWithSchema?": "boolean",
  "items?": "boolean",
  "metadata?": "boolean",
  "_count?": "boolean",
});
