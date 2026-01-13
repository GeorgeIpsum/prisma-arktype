import { type } from "arktype";
import { TestQueryModelPlain } from "./TestQueryModelPlain";
import { TestQueryModelRelations } from "./TestQueryModelRelations";

export const TestQueryModel = type(() =>
  TestQueryModelPlain.and(TestQueryModelRelations),
);
