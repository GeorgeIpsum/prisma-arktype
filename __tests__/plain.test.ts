import { describe, expect, it } from "vitest";
import { TEST_MODEL_MAP } from "./config/model-mapping";
import {
  getFixture,
  isValidationError,
  isValidationSuccess,
  loadValidator,
} from "./utils/test-helpers";

describe("Plain Model Generation", () => {
  const MODEL = TEST_MODEL_MAP.BASIC_MODEL;

  it("should generate Plain schema for model", async () => {
    const PlainValidator = await loadValidator(MODEL, "Plain");
    expect(PlainValidator).toBeDefined();
  });

  it("should validate with complete valid data", async () => {
    const PlainValidator = await loadValidator(MODEL, "Plain");
    const fixture = getFixture("TestUser");

    const result = PlainValidator({
      ...fixture,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(isValidationSuccess(result)).toBe(true);
  });

  it("should reject data with missing required fields", async () => {
    const PlainValidator = await loadValidator(MODEL, "Plain");

    const result = PlainValidator({
      id: "test",
      // missing email (required)
    });

    expect(isValidationError(result)).toBe(true);
  });

  it("should reject data with wrong types", async () => {
    const PlainValidator = await loadValidator(MODEL, "Plain");
    const fixture = getFixture("TestUser");

    const result = PlainValidator({
      ...fixture,
      email: 123, // should be string
    });

    expect(isValidationError(result)).toBe(true);
  });

  it("should allow optional fields to be omitted", async () => {
    const PlainValidator = await loadValidator(MODEL, "Plain");

    const result = PlainValidator({
      id: "test",
      email: "test@example.com",
      // name and phoneNumber are optional
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(isValidationSuccess(result)).toBe(true);
  });

  it("should validate models with enum fields using enum references", async () => {
    const TestEnumModelPlain = await loadValidator("TestEnumModel", "Plain");

    // Valid enum values
    const validResult = TestEnumModelPlain({
      id: "test",
      currency: "USD",
      status: "ACTIVE",
      optionalCurrency: "EUR",
      optionalStatus: "INACTIVE",
    });

    expect(isValidationSuccess(validResult)).toBe(true);

    // Invalid enum values
    const invalidResult = TestEnumModelPlain({
      id: "test",
      currency: "INVALID_CURRENCY",
      status: "ACTIVE",
    });

    expect(isValidationError(invalidResult)).toBe(true);
  });
});
