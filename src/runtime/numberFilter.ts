import { type } from "arktype";

/**
 * @description Number filter for Prisma where clauses
 * Supports: equals, gt, gte, in, lt, lte, not, notIn
 */
export const NumberFilter = type({
  "equals?": "number",
  "gt?": "number",
  "gte?": "number",
  "in?": "number[]",
  "lt?": "number",
  "lte?": "number",
  "not?": "number",
  "notIn?": "number[]",
});

/**
 * @description Integer filter for Prisma where clauses (Int, BigInt)
 * Supports: equals, gt, gte, in, lt, lte, not, notIn
 */
export const IntFilter = type({
  "equals?": "number.integer",
  "gt?": "number.integer",
  "gte?": "number.integer",
  "in?": "number.integer[]",
  "lt?": "number.integer",
  "lte?": "number.integer",
  "not?": "number.integer",
  "notIn?": "number.integer[]",
});
