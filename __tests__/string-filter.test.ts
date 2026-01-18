import { describe, expect, it } from "vitest";
import {
  isValidationError,
  isValidationSuccess,
  loadValidator,
} from "./utils/test-helpers";

describe("String Filter in Where Clauses", () => {
  const MODEL = "TestUser";

  describe("Direct string values", () => {
    it("should accept direct string value", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        name: "John Doe",
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept multiple string fields", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        name: "John Doe",
        phoneNumber: "+1234567890",
      });

      expect(isValidationSuccess(result)).toBe(true);
    });
  });

  describe("StringFilter operations", () => {
    it("should accept contains filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        name: { contains: "John" },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept startsWith filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        name: { startsWith: "J" },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept endsWith filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        name: { endsWith: "Doe" },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept equals filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        name: { equals: "John Doe" },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept in filter with string array", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        name: { in: ["John", "Jane", "Bob"] },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept notIn filter with string array", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        name: { notIn: ["Alice", "Eve"] },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept not filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        name: { not: "Anonymous" },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept gt (greater than) filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        name: { gt: "A" },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept gte (greater than or equal) filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        name: { gte: "A" },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept lt (less than) filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        name: { lt: "Z" },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept lte (less than or equal) filter", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        name: { lte: "Z" },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });
  });

  describe("Combined StringFilter operations", () => {
    it("should accept multiple filter conditions", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        name: {
          contains: "John",
          startsWith: "J",
        },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept filters on multiple string fields", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        name: { contains: "John" },
        phoneNumber: { startsWith: "+1" },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });
  });

  describe("Validation errors", () => {
    it("should reject invalid filter property types", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        name: { contains: 123 }, // should be string, not number
      });

      expect(isValidationError(result)).toBe(true);
    });

    it("should reject invalid in array types", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        name: { in: [123, 456] }, // should be string[], not number[]
      });

      expect(isValidationError(result)).toBe(true);
    });
  });

  describe("Fields with typeOverwrite annotation", () => {
    it("should not use StringFilter for fields with typeOverwrite", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      // email has @prisma-arktype.typeOverwrite="string.email"
      // so it should accept a direct email string but not StringFilter
      const validEmail = WhereValidator({
        email: "test@example.com",
      });

      expect(isValidationSuccess(validEmail)).toBe(true);

      // StringFilter operations should not work on email field
      const withFilter = WhereValidator({
        email: { contains: "test" },
      });

      expect(isValidationError(withFilter)).toBe(true);
    });
  });
});
