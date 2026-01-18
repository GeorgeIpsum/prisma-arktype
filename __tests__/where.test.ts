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

describe("DateTimeFilter Support", () => {
  const MODEL = TEST_MODEL_MAP.MODEL_WITH_TIMESTAMPS;

  it("should accept direct Date object for DateTime fields", async () => {
    const WhereValidator = await loadValidator(MODEL, "Where");

    const result = WhereValidator({
      createdAt: new Date("2024-01-01"),
    });

    expect(isValidationSuccess(result)).toBe(true);
  });

  it("should accept DateTimeFilter with equals", async () => {
    const WhereValidator = await loadValidator(MODEL, "Where");

    const result = WhereValidator({
      createdAt: {
        equals: new Date("2024-01-01"),
      },
    });

    expect(isValidationSuccess(result)).toBe(true);
  });

  it("should accept DateTimeFilter with comparison operators", async () => {
    const WhereValidator = await loadValidator(MODEL, "Where");

    const result = WhereValidator({
      createdAt: {
        gt: new Date("2024-01-01"),
        lte: new Date("2024-12-31"),
      },
    });

    expect(isValidationSuccess(result)).toBe(true);
  });

  it("should accept DateTimeFilter with in array", async () => {
    const WhereValidator = await loadValidator(MODEL, "Where");

    const result = WhereValidator({
      updatedAt: {
        in: [new Date("2024-01-01"), new Date("2024-02-01")],
      },
    });

    expect(isValidationSuccess(result)).toBe(true);
  });

  it("should accept DateTimeFilter with notIn array", async () => {
    const WhereValidator = await loadValidator(MODEL, "Where");

    const result = WhereValidator({
      updatedAt: {
        notIn: [new Date("2024-01-01"), new Date("2024-02-01")],
      },
    });

    expect(isValidationSuccess(result)).toBe(true);
  });

  it("should accept DateTimeFilter with not", async () => {
    const WhereValidator = await loadValidator(MODEL, "Where");

    const result = WhereValidator({
      createdAt: {
        not: new Date("2024-01-01"),
      },
    });

    expect(isValidationSuccess(result)).toBe(true);
  });

  it("should reject invalid DateTimeFilter with non-Date values", async () => {
    const WhereValidator = await loadValidator(MODEL, "Where");

    const result = WhereValidator({
      createdAt: {
        equals: "not a date",
      },
    });

    expect(isValidationSuccess(result)).toBe(false);
  });

  it("should reject invalid DateTimeFilter with wrong array type", async () => {
    const WhereValidator = await loadValidator(MODEL, "Where");

    const result = WhereValidator({
      createdAt: {
        in: ["2024-01-01", "2024-02-01"],
      },
    });

    expect(isValidationSuccess(result)).toBe(false);
  });
});
