import { type } from "arktype";

export const TestCompositeKeySelect = type({
  "tenantId?": "boolean",
  "userId?": "boolean",
  "role?": "boolean",
  "metadata?": "boolean",
  "_count?": "boolean",
});
