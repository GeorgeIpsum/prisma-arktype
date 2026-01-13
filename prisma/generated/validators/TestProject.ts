import { type } from "arktype";
import { TestProjectPlain } from "./TestProjectPlain";
import { TestProjectRelations } from "./TestProjectRelations";

export const TestProject = type(() =>
  TestProjectPlain.and(TestProjectRelations),
);
