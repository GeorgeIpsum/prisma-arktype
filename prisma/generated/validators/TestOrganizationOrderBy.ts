import { type } from "arktype";

export const TestOrganizationOrderBy = type({
  "id?": "'asc' | 'desc'",
  "name?": "'asc' | 'desc'",
});
