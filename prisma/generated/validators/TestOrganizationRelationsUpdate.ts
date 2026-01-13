import { type } from "arktype";

export const TestOrganizationRelationsUpdate = type({
  "members?": {
    "connect?": type({ id: "string" }).array(),
    "disconnect?": type({ id: "string" }).array(),
  },
  "projects?": {
    "connect?": type({ id: "string" }).array(),
    "disconnect?": type({ id: "string" }).array(),
  },
});
