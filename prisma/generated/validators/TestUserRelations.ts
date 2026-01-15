import { type } from "arktype";
import { TestMetadataPlain } from "./TestMetadataPlain";
import { TestPostPlain } from "./TestPostPlain";
import { TestProfilePlain } from "./TestProfilePlain";
export const TestUserRelations = type({
  posts: TestPostPlain.array(),
  profile: TestProfilePlain.or("null"),
  metadata: TestMetadataPlain.array(),
});
