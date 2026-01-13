import { type } from "arktype";

export const TestOptionsModelCreate = type({
  username: "string",
  "score?": "number.integer",
  normalField: "string",
});
