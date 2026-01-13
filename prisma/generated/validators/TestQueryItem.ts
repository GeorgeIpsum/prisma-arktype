import { type } from "arktype";
import { TestQueryItemPlain } from "./TestQueryItemPlain";
import { TestQueryItemRelations } from "./TestQueryItemRelations";

export const TestQueryItem = type(() =>
  TestQueryItemPlain.and(TestQueryItemRelations),
);
