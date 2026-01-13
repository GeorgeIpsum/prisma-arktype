import { type } from "arktype";

export const TestMemberOrderBy = type({
  "id?": "'asc' | 'desc'",
  "name?": "'asc' | 'desc'",
  "email?": "'asc' | 'desc'",
  "organizationId?": "'asc' | 'desc'",
});
