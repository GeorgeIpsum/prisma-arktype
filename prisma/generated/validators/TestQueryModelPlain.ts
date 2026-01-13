import { type } from "arktype";

export const TestQueryModelPlain = type({
  "id?": "string",
  title: "string",
  "subtitle?": "string | null",
  "priority?": "number.integer",
  "score?": "number",
  "isActive?": "boolean",
  "createdAt?": "Date",
  updatedAt: "Date",
});
