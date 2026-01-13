import { type } from "arktype";
import { TestTagPlain } from "./TestTagPlain";
import { TestTagRelations } from "./TestTagRelations";

export const TestTag = type(() => TestTagPlain.and(TestTagRelations));
