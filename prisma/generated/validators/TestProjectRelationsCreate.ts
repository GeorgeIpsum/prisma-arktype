import { type } from "arktype";

export const TestProjectRelationsCreate = type({
  "organization?": { connect: { id: "string" } },
});
