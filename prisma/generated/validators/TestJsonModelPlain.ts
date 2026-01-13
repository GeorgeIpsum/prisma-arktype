import { type } from "arktype";

export const TestJsonModelPlain = type({
  "id?": "string",
  "metadata?": "unknown",
  "settings?": "unknown | null",
  data: "unknown",
});
