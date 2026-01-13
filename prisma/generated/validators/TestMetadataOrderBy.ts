import { type } from "arktype";

export const TestMetadataOrderBy = type({
  "userId?": "'asc' | 'desc'",
  "key?": "'asc' | 'desc'",
  "value?": "'asc' | 'desc'",
  "createdAt?": "'asc' | 'desc'",
});
