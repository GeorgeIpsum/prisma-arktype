import { type } from "arktype";

export const TestProfilePlain = type({
  "id?": "string",
  userId: "string",
  "bio?": "string | null",
  "website?": "string | null",
  "avatarUrl?": "string | null",
  "createdAt?": "Date",
  updatedAt: "Date",
});
