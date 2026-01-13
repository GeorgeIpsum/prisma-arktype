import { type } from "arktype";
import { TestMetadataPlain } from "./TestMetadataPlain";
import { TestMetadataRelations } from "./TestMetadataRelations";

export const TestMetadata = type(() =>
  TestMetadataPlain.and(TestMetadataRelations),
);
