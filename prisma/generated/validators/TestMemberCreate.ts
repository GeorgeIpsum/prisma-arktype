import { type } from "arktype";

export const TestMemberCreate = type({
  name: "string",
  email: "string",
  organizationId: "string",
});
