import { type } from "arktype";

export const TestProfileUpdate = type({
  "userId?": "string",
  "bio?": "string | null",
  "website?": "string | null",
  "avatarUrl?": "string | null",
});
