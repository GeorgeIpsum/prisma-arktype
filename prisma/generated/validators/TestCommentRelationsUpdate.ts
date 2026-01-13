import { type } from "arktype";

export const TestCommentRelationsUpdate = type({
  "post?": { connect: { id: "string" } },
});
