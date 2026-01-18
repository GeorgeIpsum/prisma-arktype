import { type } from "arktype";

/**
 * @description Boolean filter for Prisma where clauses
 * Supports: equals, not
 */
export const BooleanFilter = type({
  "equals?": "boolean",
  "not?": "boolean",
});
