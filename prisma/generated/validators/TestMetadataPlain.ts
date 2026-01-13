import { type } from "arktype";

export const TestMetadataPlain = type({
  userId: "string",
  key: "string",
  value: "string",
  "createdAt?": "Date",
});
