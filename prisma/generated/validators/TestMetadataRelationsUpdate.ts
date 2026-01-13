import { type } from "arktype";

export const TestMetadataRelationsUpdate = type({
  "user?": { connect: { id: "string" } },
});
