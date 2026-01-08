import { describe, expect, it } from "vitest";
import { TEST_MODEL_MAP } from "./config/model-mapping";
import {
  isValidationError,
  isValidationSuccess,
  loadValidator,
} from "./utils/test-helpers";

describe("Select Schema Generation", () => {
  const MODEL = TEST_MODEL_MAP.BASIC_MODEL;

  it("should generate Select schema", async () => {
    const SelectValidator = await loadValidator(MODEL, "Select");
    expect(SelectValidator).toBeDefined();
  });

  it("should accept boolean flags for fields", async () => {
    const SelectValidator = await loadValidator(MODEL, "Select");

    const result = SelectValidator({
      id: true,
      email: true,
      name: false,
    });

    expect(isValidationSuccess(result)).toBe(true);
  });
});

describe("Include Schema Generation", () => {
  const MODEL = TEST_MODEL_MAP.MODEL_WITH_RELATIONS;

  it("should generate Include schema", async () => {
    const IncludeValidator = await loadValidator(MODEL, "Include");
    expect(IncludeValidator).toBeDefined();
  });

  it("should accept boolean flags for relations", async () => {
    const IncludeValidator = await loadValidator(MODEL, "Include");

    const result = IncludeValidator({
      payments: true,
      profile: false,
    });

    expect(isValidationSuccess(result)).toBe(true);
  });
});

describe("OrderBy Schema Generation", () => {
  const MODEL = TEST_MODEL_MAP.BASIC_MODEL;

  it("should generate OrderBy schema", async () => {
    const OrderByValidator = await loadValidator(MODEL, "OrderBy");
    expect(OrderByValidator).toBeDefined();
  });

  it("should accept asc/desc for fields", async () => {
    const OrderByValidator = await loadValidator(MODEL, "OrderBy");

    const result = OrderByValidator({
      email: "asc",
      createdAt: "desc",
    });

    expect(isValidationSuccess(result)).toBe(true);
  });

  it("should reject invalid sort directions", async () => {
    const OrderByValidator = await loadValidator(MODEL, "OrderBy");

    const result = OrderByValidator({
      email: "invalid",
    });

    expect(isValidationError(result)).toBe(true);
  });
});
