import { type } from "arktype";

export const TestUserRelationsUpdate = type({
  "posts?": {
    "connect?": type({ id: "string" }).array(),
    "disconnect?": type({ id: "string" }).array(),
  },
  "profile?": { "connect?": { id: "string" }, "disconnect?": "boolean" },
  "metadata?": {
    "connect?": type({ id: "string" }).array(),
    "disconnect?": type({ id: "string" }).array(),
  },
});
