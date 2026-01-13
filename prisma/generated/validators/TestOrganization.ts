import { type } from "arktype";
import { TestOrganizationPlain } from "./TestOrganizationPlain";
import { TestOrganizationRelations } from "./TestOrganizationRelations";

export const TestOrganization = type(() =>
  TestOrganizationPlain.and(TestOrganizationRelations),
);
