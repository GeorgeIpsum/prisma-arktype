import { describe, expect, it } from "vitest";
import { TEST_MODEL_MAP } from "./config/model-mapping";
import {
  isValidationError,
  isValidationSuccess,
  loadEnumValidator,
} from "./utils/test-helpers";

describe("Enum Generation", () => {
  describe(TEST_MODEL_MAP.BASIC_ENUM, () => {
    it("should validate valid enum values", async () => {
      const EnumValidator = await loadEnumValidator(TEST_MODEL_MAP.BASIC_ENUM);

      for (const value of TEST_MODEL_MAP.ENUM_VALUES) {
        const result = EnumValidator(value);
        expect(isValidationSuccess(result)).toBe(true);
      }
    });

    it("should reject invalid enum values", async () => {
      const EnumValidator = await loadEnumValidator(TEST_MODEL_MAP.BASIC_ENUM);

      const result = EnumValidator("INVALID_VALUE");
      expect(isValidationError(result)).toBe(true);
    });
  });

  describe(TEST_MODEL_MAP.STATUS_ENUM, () => {
    it("should validate valid status enum values", async () => {
      const EnumValidator = await loadEnumValidator(TEST_MODEL_MAP.STATUS_ENUM);

      for (const value of TEST_MODEL_MAP.STATUS_VALUES) {
        const result = EnumValidator(value);
        expect(isValidationSuccess(result)).toBe(true);
      }
    });
  });
});
