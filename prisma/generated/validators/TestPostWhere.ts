import { type } from "arktype";

export const TestPostWhere = type({
  "id?": "string",
  "title?": "string",
  "content?": "string",
  "published?": "boolean",
  "views?": "number.integer",
  "rating?": "number",
  "authorId?": "string",
  "createdAt?": "Date",
  "updatedAt?": "Date",
});
