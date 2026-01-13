import { type } from "arktype";

export const TestOrganizationRelationsCreate = type({
  "members?": { connect: { id: "string" } },
  "projects?": { connect: { id: "string" } },
});
