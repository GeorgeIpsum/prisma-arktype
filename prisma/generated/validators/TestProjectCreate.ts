import { type } from "arktype";

export const TestProjectCreate = type({
  name: "string",
  "description?": "string | null",
  organizationId: "string",
});
