import { describe, expect, it } from "vitest";
import { TEST_MODEL_MAP } from "./config/model-mapping";
import {
  getFixture,
  isValidationSuccess,
  loadValidator,
} from "./utils/test-helpers";

describe("Create Input Generation", () => {
  const MODEL = TEST_MODEL_MAP.MODEL_WITH_TIMESTAMPS;

  it("should generate Create schema", async () => {
    const CreateValidator = await loadValidator(MODEL, "Create");
    expect(CreateValidator).toBeDefined();
  });

  it("should exclude auto-generated id field", async () => {
    const CreateValidator = await loadValidator(MODEL, "Create");
    const fixture = getFixture("TestUser");

    // Should work without id (auto-generated)
    const result = CreateValidator({
      email: fixture.email,
      name: fixture.name,
      phoneNumber: fixture.phoneNumber,
    });

    expect(isValidationSuccess(result)).toBe(true);
  });

  it("should exclude createdAt and updatedAt (auto-generated)", async () => {
    const CreateValidator = await loadValidator(MODEL, "Create");

    // Should work without timestamps
    const result = CreateValidator({
      email: "test@example.com",
      name: "Test",
    });

    expect(isValidationSuccess(result)).toBe(true);
  });
});

describe("Update Input Generation", () => {
  const MODEL = TEST_MODEL_MAP.MODEL_WITH_TIMESTAMPS;

  it("should generate Update schema", async () => {
    const UpdateValidator = await loadValidator(MODEL, "Update");
    expect(UpdateValidator).toBeDefined();
  });

  it("should make all fields optional", async () => {
    const UpdateValidator = await loadValidator(MODEL, "Update");

    // Empty object should be valid
    const result = UpdateValidator({});
    expect(isValidationSuccess(result)).toBe(true);
  });

  it("should accept partial data", async () => {
    const UpdateValidator = await loadValidator(MODEL, "Update");

    const result = UpdateValidator({
      name: "Updated Name",
    });

    expect(isValidationSuccess(result)).toBe(true);
  });
});
