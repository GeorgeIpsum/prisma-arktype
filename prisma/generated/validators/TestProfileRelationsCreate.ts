import { type } from "arktype";

export const TestProfileRelationsCreate = type({
  "user?": { connect: { id: "string" } },
});
