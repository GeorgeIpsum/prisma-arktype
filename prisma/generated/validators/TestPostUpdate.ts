import { type } from "arktype";

export const TestPostUpdate = type({
  "title?": "string",
  "content?": "string | null",
  "published?": "boolean",
  "views?": "number.integer",
  "rating?": "number | null",
  "authorId?": "string",
});
