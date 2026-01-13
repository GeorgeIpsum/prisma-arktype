import { type } from "arktype";

export const TestProjectRelationsUpdate = type({
  "organization?": { connect: { id: "string" } },
});
