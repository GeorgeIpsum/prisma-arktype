import { type } from "arktype";

export const TestQueryModelUpdate = type({
  "title?": "string",
  "subtitle?": "string | null",
  "priority?": "number.integer",
  "score?": "number",
  "isActive?": "boolean",
});
