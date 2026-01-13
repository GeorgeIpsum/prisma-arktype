import { type } from "arktype";

export const TestQueryModelCreate = type({
  title: "string",
  "subtitle?": "string | null",
  "priority?": "number.integer",
  "score?": "number",
  "isActive?": "boolean",
});
