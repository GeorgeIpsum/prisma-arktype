import { type } from "arktype";

export const TestQueryModelRelationsCreate = type({
  "items?": { connect: { id: "string" } },
});
