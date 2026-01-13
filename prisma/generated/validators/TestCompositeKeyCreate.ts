import { type } from "arktype";

export const TestCompositeKeyCreate = type({
  tenantId: "string",
  userId: "string",
  role: "string",
  "metadata?": "unknown",
});
