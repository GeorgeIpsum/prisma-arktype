import { describe, expect, it } from "vitest";
import {
  isValidationError,
  isValidationSuccess,
  loadValidator,
} from "./utils/test-helpers";

describe("Number Filter in Where Clauses", () => {
  const MODEL = "TestPost";

  describe("Direct number values", () => {
    it("should accept direct integer value", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        views: 100,
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept direct float value", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        rating: 4.5,
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept multiple number fields", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        views: 100,
        rating: 4.5,
      });

      expect(isValidationSuccess(result)).toBe(true);
    });
  });

  describe("IntFilter operations", () => {
    it("should accept equals filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        views: { equals: 100 },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept gt (greater than) filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        views: { gt: 50 },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept gte (greater than or equal) filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        views: { gte: 100 },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept lt (less than) filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        views: { lt: 1000 },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept lte (less than or equal) filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        views: { lte: 500 },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept in filter with integer array", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        views: { in: [10, 20, 30, 100] },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept notIn filter with integer array", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        views: { notIn: [0, 1, 2] },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept not filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        views: { not: 0 },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should reject non-integer values in IntFilter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        views: { equals: 3.14 }, // should be integer
      });

      expect(isValidationError(result)).toBe(true);
    });
  });

  describe("NumberFilter operations", () => {
    it("should accept equals filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        rating: { equals: 4.5 },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept gt filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        rating: { gt: 3.0 },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept gte filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        rating: { gte: 4.0 },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept lt filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        rating: { lt: 5.0 },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept lte filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        rating: { lte: 5.0 },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept in filter with number array", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        rating: { in: [3.5, 4.0, 4.5, 5.0] },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept notIn filter with number array", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        rating: { notIn: [1.0, 2.0] },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept not filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        rating: { not: 0.0 },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept decimal values", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        rating: { equals: 4.123456 },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });
  });

  describe("Combined filter operations", () => {
    it("should accept multiple filter conditions on Int field", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        views: {
          gte: 10,
          lte: 1000,
        },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept multiple filter conditions on Float field", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        rating: {
          gte: 3.0,
          lte: 5.0,
        },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept filters on both Int and Float fields", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        views: { gte: 100 },
        rating: { gte: 4.0 },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });
  });

  describe("Validation errors", () => {
    it("should reject string in IntFilter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        views: { equals: "not-a-number" },
      });

      expect(isValidationError(result)).toBe(true);
    });

    it("should reject string in NumberFilter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        rating: { equals: "not-a-number" },
      });

      expect(isValidationError(result)).toBe(true);
    });

    it("should reject invalid in array types", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        views: { in: ["a", "b", "c"] },
      });

      expect(isValidationError(result)).toBe(true);
    });
  });
});
