import { type } from "arktype";

/**
 * @description Generic enum filter for Prisma where clauses
 * Supports: equals, in, not, notIn
 */
export const enumFilter = type("<t>", {
  "equals?": "t",
  "in?": "t[]",
  "not?": "t",
  "notIn?": "t[]",
});
