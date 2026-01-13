import { type } from "arktype";

export const TestQueryModelRelationsUpdate = type({
  "items?": {
    "connect?": type({ id: "string" }).array(),
    "disconnect?": type({ id: "string" }).array(),
  },
});
