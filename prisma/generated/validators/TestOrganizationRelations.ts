import { type } from "arktype";
import { TestMemberPlain } from "./TestMemberPlain";
import { TestProjectPlain } from "./TestProjectPlain";
export const TestOrganizationRelations = type({
  members: TestMemberPlain.array(),
  projects: TestProjectPlain.array(),
});
