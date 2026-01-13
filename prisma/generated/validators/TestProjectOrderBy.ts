import { type } from "arktype";

export const TestProjectOrderBy = type({
  "id?": "'asc' | 'desc'",
  "name?": "'asc' | 'desc'",
  "description?": "'asc' | 'desc'",
  "organizationId?": "'asc' | 'desc'",
});
