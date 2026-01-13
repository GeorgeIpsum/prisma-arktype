import { type } from "arktype";

export const TestPostPlain = type({
  "id?": "string",
  title: "string",
  "content?": "string | null",
  "published?": "boolean",
  "views?": "number.integer",
  "rating?": "number | null",
  authorId: "string",
  "createdAt?": "Date",
  updatedAt: "Date",
});
