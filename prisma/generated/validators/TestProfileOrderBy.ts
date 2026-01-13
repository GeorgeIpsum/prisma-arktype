import { type } from "arktype";

export const TestProfileOrderBy = type({
  "id?": "'asc' | 'desc'",
  "userId?": "'asc' | 'desc'",
  "bio?": "'asc' | 'desc'",
  "website?": "'asc' | 'desc'",
  "avatarUrl?": "'asc' | 'desc'",
  "createdAt?": "'asc' | 'desc'",
  "updatedAt?": "'asc' | 'desc'",
});
