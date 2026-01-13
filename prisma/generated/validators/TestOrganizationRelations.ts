import { type } from "arktype";

export const TestOrganizationRelations = type({
  members: type("unknown").array(),
  projects: type("unknown").array(),
});
