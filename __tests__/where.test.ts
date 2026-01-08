import { describe, expect, it } from "vitest";
import { TEST_MODEL_MAP } from "./config/model-mapping";
import { isValidationSuccess, loadValidator } from "./utils/test-helpers";

describe("Where Clause Generation", () => {
  const MODEL = TEST_MODEL_MAP.MODEL_WITH_UNIQUE;

  it("should generate Where schema", async () => {
    const WhereValidator = await loadValidator(MODEL, "Where");
    expect(WhereValidator).toBeDefined();
  });

  it("should make all fields optional in Where", async () => {
    const WhereValidator = await loadValidator(MODEL, "Where");

    const result = WhereValidator({});
    expect(isValidationSuccess(result)).toBe(true);
  });

  it("should accept partial where conditions", async () => {
    const WhereValidator = await loadValidator(MODEL, "Where");

    const result = WhereValidator({
      email: "test@example.com",
    });

    expect(isValidationSuccess(result)).toBe(true);
  });
});

describe("WhereUnique Clause Generation", () => {
  const MODEL = TEST_MODEL_MAP.MODEL_WITH_UNIQUE;

  it("should generate WhereUnique schema", async () => {
    const WhereUniqueValidator = await loadValidator(MODEL, "WhereUnique");
    expect(WhereUniqueValidator).toBeDefined();
  });

  it("should accept unique identifier", async () => {
    const WhereUniqueValidator = await loadValidator(MODEL, "WhereUnique");

    const result = WhereUniqueValidator({
      id: "test123",
    });

    expect(isValidationSuccess(result)).toBe(true);
  });

  it("should accept unique field", async () => {
    const WhereUniqueValidator = await loadValidator(MODEL, "WhereUnique");

    const result = WhereUniqueValidator({
      email: "test@example.com",
    });

    expect(isValidationSuccess(result)).toBe(true);
  });
});
