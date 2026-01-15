import { type } from "arktype";
import { TestQueryItemPlain } from "./TestQueryItemPlain";
export const TestQueryModelRelations = type({
  items: TestQueryItemPlain.array(),
});
