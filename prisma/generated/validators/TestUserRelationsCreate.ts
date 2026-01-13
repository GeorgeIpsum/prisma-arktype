import { type } from "arktype";

export const TestUserRelationsCreate = type({
  "posts?": { connect: { id: "string" } },
  "profile?": { connect: { id: "string" } },
  "metadata?": { connect: { id: "string" } },
});
