import { type } from "arktype";

export const TestProfileWhere = type({
  "id?": "string",
  "userId?": "string",
  "bio?": "string",
  "website?": "string",
  "avatarUrl?": "string",
  "createdAt?": "Date",
  "updatedAt?": "Date",
});
