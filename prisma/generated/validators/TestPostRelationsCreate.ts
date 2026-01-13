import { type } from "arktype";

export const TestPostRelationsCreate = type({
  "author?": { connect: { id: "string" } },
  "tags?": { connect: { id: "string" } },
  "comments?": { connect: { id: "string" } },
});
