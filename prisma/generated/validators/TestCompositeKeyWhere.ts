import { type } from "arktype";

export const TestCompositeKeyWhere = type({
  "tenantId?": "string",
  "userId?": "string",
  "role?": "string",
  "metadata?": "unknown",
});
