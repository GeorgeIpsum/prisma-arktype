import { type } from "arktype";

export const TestCompositeKeyUpdate = type({
  "tenantId?": "string",
  "userId?": "string",
  "role?": "string",
  "metadata?": "unknown",
});
