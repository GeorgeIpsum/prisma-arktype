import { type } from "arktype";

export const TestOptionsModelPlain = type({
  "id?": "string",
  username: "string",
  "score?": "number.integer",
  normalField: "string",
});
