import { type } from "arktype";

export const TestMetadataRelationsCreate = type({
  "user?": { connect: { id: "string" } },
});
