import { type } from "arktype";
import { TestPostPlain } from "./TestPostPlain";
import { TestPostRelations } from "./TestPostRelations";

export const TestPost = type(() => TestPostPlain.and(TestPostRelations));
