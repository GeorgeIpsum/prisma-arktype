import { type } from "arktype";

/**
 * @description Generic array filter for Prisma where clauses
 * Supports: isEmpty, has, hasEvery, hasSome, equals
 */
export const arrayFilter = type("<t>", {
  "isEmpty?": "boolean",
  "has?": "t",
  "hasEvery?": "t[]",
  "hasSome?": "t[]",
  "equals?": "t[]",
});

/**
 * @description String array filter for Prisma where clauses
 */
export const StringArrayFilter = arrayFilter("string");

/**
 * @description Number array filter for Prisma where clauses
 */
export const NumberArrayFilter = arrayFilter("number");

/**
 * @description BigInt array filter for Prisma where clauses
 */
export const BigIntArrayFilter = arrayFilter("number.integer");
