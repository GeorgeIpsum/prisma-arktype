import { type } from "arktype";
import { TestProfilePlain } from "./TestProfilePlain";
import { TestProfileRelations } from "./TestProfileRelations";

export const TestProfile = type(() =>
  TestProfilePlain.and(TestProfileRelations),
);
