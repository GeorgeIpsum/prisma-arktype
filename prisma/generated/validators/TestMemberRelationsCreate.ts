import { type } from "arktype";

export const TestMemberRelationsCreate = type({
  "organization?": { connect: { id: "string" } },
});
