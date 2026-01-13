import { type } from "arktype";

export const TestProfileRelationsUpdate = type({
  "user?": { connect: { id: "string" } },
});
