import { type } from "arktype";

export const TestPostInclude = type({
  "author?": "boolean",
  "tags?": "boolean",
  "comments?": "boolean",
  "_count?": "boolean",
});
