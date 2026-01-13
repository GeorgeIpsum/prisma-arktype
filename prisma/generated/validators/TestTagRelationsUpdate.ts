import { type } from "arktype";

export const TestTagRelationsUpdate = type({
  "posts?": {
    "connect?": type({ id: "string" }).array(),
    "disconnect?": type({ id: "string" }).array(),
  },
});
