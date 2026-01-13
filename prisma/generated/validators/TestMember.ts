import { type } from "arktype";
import { TestMemberPlain } from "./TestMemberPlain";
import { TestMemberRelations } from "./TestMemberRelations";

export const TestMember = type(() => TestMemberPlain.and(TestMemberRelations));
