import { type } from "arktype";

export const TestCompositeKeyOrderBy = type({
  "tenantId?": "'asc' | 'desc'",
  "userId?": "'asc' | 'desc'",
  "role?": "'asc' | 'desc'",
  "metadata?": "'asc' | 'desc'",
});
