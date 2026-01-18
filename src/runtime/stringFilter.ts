import { type } from "arktype";

/**
 * @description String filter for Prisma where clauses
 * Supports: contains, endsWith, equals, gt, gte, in, lt, lte, not, notIn, startsWith
 */
export const StringFilter = type({
  "contains?": "string",
  "endsWith?": "string",
  "equals?": "string",
  "gt?": "string",
  "gte?": "string",
  "in?": "string[]",
  "lt?": "string",
  "lte?": "string",
  "not?": "string",
  "notIn?": "string[]",
  "startsWith?": "string",
});
