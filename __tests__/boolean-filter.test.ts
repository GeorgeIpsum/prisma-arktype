import { describe, expect, it } from "vitest";
import {
  isValidationError,
  isValidationSuccess,
  loadValidator,
} from "./utils/test-helpers";

describe("BooleanFilter in Where Clauses", () => {
  describe("TestPost.published (Boolean)", () => {
    it("should accept direct boolean value", async () => {
      const WhereValidator = await loadValidator("TestPost", "Where");

      const withTrue = WhereValidator({ published: true });
      expect(isValidationSuccess(withTrue)).toBe(true);

      const withFalse = WhereValidator({ published: false });
      expect(isValidationSuccess(withFalse)).toBe(true);
    });

    it("should accept BooleanFilter with equals", async () => {
      const WhereValidator = await loadValidator("TestPost", "Where");

      const result = WhereValidator({
        published: { equals: true },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept BooleanFilter with not", async () => {
      const WhereValidator = await loadValidator("TestPost", "Where");

      const result = WhereValidator({
        published: { not: false },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept BooleanFilter with both equals and not", async () => {
      const WhereValidator = await loadValidator("TestPost", "Where");

      const result = WhereValidator({
        published: { equals: true, not: false },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should reject invalid types for equals", async () => {
      const WhereValidator = await loadValidator("TestPost", "Where");

      const result = WhereValidator({
        published: { equals: "true" },
      });

      expect(isValidationError(result)).toBe(true);
    });

    it("should reject invalid types for not", async () => {
      const WhereValidator = await loadValidator("TestPost", "Where");

      const result = WhereValidator({
        published: { not: 1 },
      });

      expect(isValidationError(result)).toBe(true);
    });

    it("should reject non-boolean direct values", async () => {
      const WhereValidator = await loadValidator("TestPost", "Where");

      const withString = WhereValidator({ published: "true" });
      expect(isValidationError(withString)).toBe(true);

      const withNumber = WhereValidator({ published: 1 });
      expect(isValidationError(withNumber)).toBe(true);

      const withNull = WhereValidator({ published: null });
      expect(isValidationError(withNull)).toBe(true);
    });
  });

  describe("TestAllTypes.boolean (Boolean)", () => {
    it("should accept direct boolean value", async () => {
      const WhereValidator = await loadValidator("TestAllTypes", "Where");

      const result = WhereValidator({ boolean: true });
      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept BooleanFilter", async () => {
      const WhereValidator = await loadValidator("TestAllTypes", "Where");

      const withEquals = WhereValidator({
        boolean: { equals: false },
      });
      expect(isValidationSuccess(withEquals)).toBe(true);

      const withNot = WhereValidator({
        boolean: { not: true },
      });
      expect(isValidationSuccess(withNot)).toBe(true);
    });
  });

  describe("TestUser.isActive (Boolean)", () => {
    it("should accept direct boolean value", async () => {
      const WhereValidator = await loadValidator("TestUser", "Where");

      const result = WhereValidator({ isActive: true });
      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept BooleanFilter", async () => {
      const WhereValidator = await loadValidator("TestUser", "Where");

      const result = WhereValidator({
        isActive: { equals: true, not: false },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });
  });

  describe("Multiple boolean filters in one query", () => {
    it("should accept multiple boolean filters", async () => {
      const WhereValidator = await loadValidator("TestUser", "Where");

      const result = WhereValidator({
        isActive: { equals: true },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept mix of direct and filter values", async () => {
      const WhereValidator = await loadValidator("TestPost", "Where");

      const result = WhereValidator({
        published: true,
        title: { contains: "test" },
      });

      expect(isValidationSuccess(result)).toBe(true);
    });
  });
});
