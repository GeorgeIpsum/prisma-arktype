import { type } from "arktype";

export const TestOrganizationInclude = type({
  "members?": "boolean",
  "projects?": "boolean",
  "_count?": "boolean",
});
