import { type } from "arktype";

export const TestQueryModelRelations = type({
  items: type("unknown").array(),
});
