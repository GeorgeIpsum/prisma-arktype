import { type } from "arktype";

export const TestProfileCreate = type({
  userId: "string",
  "bio?": "string | null",
  "website?": "string | null",
  "avatarUrl?": "string | null",
});
