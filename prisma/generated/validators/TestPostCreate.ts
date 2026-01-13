import { type } from "arktype";

export const TestPostCreate = type({
  title: "string",
  "content?": "string | null",
  "published?": "boolean",
  "views?": "number.integer",
  "rating?": "number | null",
  authorId: "string",
});
