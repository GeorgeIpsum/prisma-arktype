import { type } from "arktype";

export const TestTagRelationsCreate = type({
  "posts?": { connect: { id: "string" } },
});
