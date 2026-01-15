import { type } from "arktype";
import { TestOrganizationPlain } from "./TestOrganizationPlain";
export const TestProjectRelations = type({
  organization: TestOrganizationPlain,
});
