import { type } from "arktype";

export const TestQueryModelWhere = type({
  "id?": "string",
  "title?": "string",
  "subtitle?": "string",
  "priority?": "number.integer",
  "score?": "number",
  "isActive?": "boolean",
  "createdAt?": "Date",
  "updatedAt?": "Date",
});
