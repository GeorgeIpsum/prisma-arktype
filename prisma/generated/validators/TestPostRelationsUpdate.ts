import { type } from "arktype";

export const TestPostRelationsUpdate = type({
  "author?": { connect: { id: "string" } },
  "tags?": {
    "connect?": type({ id: "string" }).array(),
    "disconnect?": type({ id: "string" }).array(),
  },
  "comments?": {
    "connect?": type({ id: "string" }).array(),
    "disconnect?": type({ id: "string" }).array(),
  },
});
