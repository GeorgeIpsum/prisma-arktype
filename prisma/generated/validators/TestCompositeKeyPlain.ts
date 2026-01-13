import { type } from "arktype";

export const TestCompositeKeyPlain = type({
  tenantId: "string",
  userId: "string",
  role: "string",
  "metadata?": "unknown",
});
