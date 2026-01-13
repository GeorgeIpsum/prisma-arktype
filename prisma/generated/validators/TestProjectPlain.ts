import { type } from "arktype";

export const TestProjectPlain = type({
  "id?": "string",
  name: "string",
  "description?": "string | null",
  organizationId: "string",
});
