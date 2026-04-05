import { describe, expect, it } from "vitest";
import { TEST_MODEL_MAP } from "./config/model-mapping";
import { isValidationSuccess, loadValidator } from "./utils/test-helpers";

describe("Relations Schema Generation", () => {
  const PARENT_MODEL = TEST_MODEL_MAP.ONE_TO_ONE_PARENT;
  const _CHILD_MODEL = TEST_MODEL_MAP.ONE_TO_ONE_CHILD;

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
      // Arrays should accept multiple elements with valid related model data
      posts: [
        {
          id: "post_1",
          title: "Post 1",
          content: null,
          published: false,
          views: 0,
          rating: null,
          authorId: "user_test",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "post_2",
          title: "Post 2",
          content: null,
          published: false,
          views: 0,
          rating: null,
          authorId: "user_test",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "post_3",
          title: "Post 3",
          content: null,
          published: false,
          views: 0,
          rating: null,
          authorId: "user_test",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      profile: null,
      metadata: [
        {
          userId: "user_test",
          key: "meta1",
          value: "value1",
          createdAt: new Date(),
        },
        {
          userId: "user_test",
          key: "meta2",
          value: "value2",
          createdAt: new Date(),
        },
      ],
    });

    expect(isValidationSuccess(result)).toBe(true);
  });
});
