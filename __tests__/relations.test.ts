import { describe, expect, it } from "vitest";
import { TEST_MODEL_MAP } from "./config/model-mapping";
import { isValidationSuccess, loadValidator } from "./utils/test-helpers";

describe("Relations Schema Generation", () => {
  const PARENT_MODEL = TEST_MODEL_MAP.ONE_TO_ONE_PARENT;
  const CHILD_MODEL = TEST_MODEL_MAP.ONE_TO_ONE_CHILD;

  it("should generate Relations schema", async () => {
    const RelationsValidator = await loadValidator(PARENT_MODEL, "Relations");
    expect(RelationsValidator).toBeDefined();
  });

  it("should generate combined Model schema", async () => {
    const ModelValidator = await loadValidator(PARENT_MODEL);
    expect(ModelValidator).toBeDefined();
  });

  it("should validate model with relations", async () => {
    const ModelValidator = await loadValidator(PARENT_MODEL);

    const result = ModelValidator({
      id: "user_test",
      email: "test@example.com",
      name: "Test User",
      phoneNumber: "+1234567890",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Relations would be included here (TestUser relations)
      posts: [],
      profile: null,
      metadata: [],
    });

    expect(isValidationSuccess(result)).toBe(true);
  });

  it("should validate arrays with multiple elements", async () => {
    const ModelValidator = await loadValidator(PARENT_MODEL);

    const result = ModelValidator({
      id: "user_test",
      email: "test@example.com",
      name: "Test User",
      phoneNumber: "+1234567890",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Arrays should accept multiple elements, not just single-element tuples
      posts: [{}, {}, {}], // Multiple posts
      profile: null,
      metadata: [{}, {}], // Multiple metadata
    });

    expect(isValidationSuccess(result)).toBe(true);
  });
});
