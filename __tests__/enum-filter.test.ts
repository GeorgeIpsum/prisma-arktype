import { describe, expect, it } from "vitest";
import {
  isValidationError,
  isValidationSuccess,
  loadValidator,
} from "./utils/test-helpers";

describe("Enum Filter in Where Clauses", () => {
  const MODEL = "TestEnumModel";

  describe("Direct enum values", () => {
    it("should accept direct enum value", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        currency: "USD",
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept multiple enum fields", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        currency: "EUR",
        status: "ACTIVE",
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should reject invalid enum value", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        currency: "INVALID_CURRENCY",
      });

      expect(isValidationError(result)).toBe(true);
    });
  });

  describe("EnumFilter operations", () => {
    it("should accept equals filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        currency: { equals: "USD" },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept in filter with enum array", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        currency: { in: ["USD", "EUR", "GBP"] },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept notIn filter with enum array", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        currency: { notIn: ["JPY", "CNY"] },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept not filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        status: { not: "INACTIVE" },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should reject invalid enum value in equals", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        currency: { equals: "INVALID" },
      });

      expect(isValidationError(result)).toBe(true);
    });

    it("should reject invalid enum values in 'in' filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        currency: { in: ["USD", "INVALID", "EUR"] },
      });

      expect(isValidationError(result)).toBe(true);
    });

    it("should reject non-array in 'in' filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        currency: { in: "USD" },
      });

      expect(isValidationError(result)).toBe(true);
    });
  });

  describe("Combined filter operations", () => {
    it("should accept multiple filter conditions", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        currency: {
          in: ["USD", "EUR"],
          not: "GBP",
        },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept filters on multiple enum fields", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        currency: { in: ["USD", "EUR"] },
        status: { equals: "ACTIVE" },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });
  });

  describe("Optional enum fields", () => {
    it("should accept filter on optional enum field", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        optionalCurrency: { equals: "USD" },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept 'in' filter on optional enum field", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        optionalStatus: { in: ["ACTIVE", "PENDING"] },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });
  });

  describe("Combined with other field types", () => {
    it("should accept enum filter with string filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        id: { contains: "test" },
        currency: { equals: "USD" },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });
  });
});
