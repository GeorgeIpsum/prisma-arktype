import { type } from "arktype";

export const TestMemberRelationsUpdate = type({
  "organization?": { connect: { id: "string" } },
});
