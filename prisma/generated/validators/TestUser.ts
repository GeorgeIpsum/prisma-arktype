import { type } from "arktype";
import { TestUserPlain } from "./TestUserPlain";
import { TestUserRelations } from "./TestUserRelations";

export const TestUser = type(() => TestUserPlain.and(TestUserRelations));
