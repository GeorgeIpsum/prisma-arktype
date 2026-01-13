import { type } from "arktype";

export const TestCommentRelationsCreate = type({
  "post?": { connect: { id: "string" } },
});
