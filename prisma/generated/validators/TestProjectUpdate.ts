import { type } from "arktype";

export const TestProjectUpdate = type({
  "name?": "string",
  "description?": "string | null",
  "organizationId?": "string",
});
