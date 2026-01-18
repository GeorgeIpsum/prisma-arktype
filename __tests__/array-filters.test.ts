import { describe, expect, it } from "vitest";
import {
  isValidationError,
  isValidationSuccess,
  loadValidator,
} from "./utils/test-helpers";

describe("Array Filters in Where Clauses", () => {
  const MODEL = "TestArrayFilter";

  describe("String Array Filters", () => {
    it("should accept isEmpty filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        keys: { isEmpty: true },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept has filter with single string", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        keys: { has: "test-key" },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept hasEvery filter with string array", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        keys: { hasEvery: ["key1", "key2", "key3"] },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept hasSome filter with string array", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        keys: { hasSome: ["key1", "key2"] },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept equals filter with string array", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        keys: { equals: ["exact", "match"] },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should reject invalid filter type", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        keys: { has: 123 }, // should be string, not number
      });

      expect(isValidationError(result)).toBe(true);
    });

    it("should accept multiple filters combined", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        keys: {
          has: "test",
          isEmpty: false,
        },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });
  });

  describe("Enum Array Filters", () => {
    it("should accept isEmpty filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        enumKeys: { isEmpty: true },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept has filter with enum value", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const TestStatusEnum = await import(
        "../prisma/generated/validators/TestStatus"
      );

      const result = WhereValidator({
        enumKeys: { has: "ACTIVE" },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept hasEvery filter with enum array", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        enumKeys: { hasEvery: ["ACTIVE", "PENDING"] },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept hasSome filter with enum array", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        enumKeys: { hasSome: ["ACTIVE", "INACTIVE"] },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept equals filter with enum array", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        enumKeys: { equals: ["ACTIVE"] },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should reject invalid enum value", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        enumKeys: { has: "INVALID_STATUS" },
      });

      expect(isValidationError(result)).toBe(true);
    });

    it("should accept multiple filters combined", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        enumKeys: {
          has: "ACTIVE",
          isEmpty: false,
        },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });
  });

  describe("Number Array Filters", () => {
    it("should accept isEmpty filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        numbers: { isEmpty: true },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept has filter with single number", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        numbers: { has: 42 },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept hasEvery filter with number array", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        numbers: { hasEvery: [1, 2, 3] },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should reject invalid type", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        numbers: { has: "not-a-number" },
      });

      expect(isValidationError(result)).toBe(true);
    });
  });

  describe("BigInt Array Filters", () => {
    it("should accept isEmpty filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        bigInts: { isEmpty: false },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept has filter with integer", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        bigInts: { has: 9007199254740991 },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept equals filter with integer array", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        bigInts: { equals: [1, 2, 3] },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should reject non-integer values", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        bigInts: { has: 3.14 }, // Should be integer
      });

      expect(isValidationError(result)).toBe(true);
    });
  });

  describe("Combined Array Filters", () => {
    it("should accept filters on all array fields simultaneously", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        keys: { has: "test-key" },
        numbers: { hasEvery: [1, 2, 3] },
        bigInts: { isEmpty: false },
        enumKeys: { has: "ACTIVE" },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });
  });
});
