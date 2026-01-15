import { type } from "arktype";
import { TestOrganizationPlain } from "./TestOrganizationPlain";
export const TestMemberRelations = type({
  organization: TestOrganizationPlain,
});
