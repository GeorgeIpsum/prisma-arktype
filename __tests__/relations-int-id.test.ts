import { describe, expect, it } from "vitest";
import { TEST_FIXTURES, TEST_MODEL_MAP } from "./config/model-mapping";
import { isValidationSuccess, loadValidator } from "./utils/test-helpers";

describe("Int ID Relations Schema Generation", () => {
  const PARENT_MODEL = TEST_MODEL_MAP.INT_ID_PARENT;
  const CHILD_MODEL = TEST_MODEL_MAP.INT_ID_CHILD;

  it("should generate parent schema", async () => {
    const ParentValidator = await loadValidator(PARENT_MODEL);
    expect(ParentValidator).toBeDefined();
  });

  it("should generate child schema", async () => {
    const ChildValidator = await loadValidator(CHILD_MODEL);
    expect(ChildValidator).toBeDefined();
  });

  it("should validate parent with int id", async () => {
    const ParentValidator = await loadValidator(PARENT_MODEL);
    const result = ParentValidator({
      ...TEST_FIXTURES.TestIntIdParent,
      children: [],
    });
    expect(isValidationSuccess(result)).toBe(true);
  });

  it("should validate child with int id and foreign key", async () => {
    const ChildValidator = await loadValidator(CHILD_MODEL);
    const result = ChildValidator({
      ...TEST_FIXTURES.TestIntIdChild,
      parent: {
        ...TEST_FIXTURES.TestIntIdParent,
      },
    });
    expect(isValidationSuccess(result)).toBe(true);
  });

  it("should validate parent with nested children", async () => {
    const ModelValidator = await loadValidator(PARENT_MODEL);
    const result = ModelValidator({
      ...TEST_FIXTURES.TestIntIdParent,
      children: [TEST_FIXTURES.TestIntIdChild],
    });
    expect(isValidationSuccess(result)).toBe(true);
  });

  it("should validate parent with multiple children", async () => {
    const ModelValidator = await loadValidator(PARENT_MODEL);
    const result = ModelValidator({
      ...TEST_FIXTURES.TestIntIdParent,
      children: [
        {
          id: 1,
          label: "Child 1",
          parentId: 1,
          parent: {
            ...TEST_FIXTURES.TestIntIdParent,
          },
        },
        {
          id: 2,
          label: "Child 2",
          parentId: 1,
          parent: {
            ...TEST_FIXTURES.TestIntIdParent,
          },
        },
        {
          id: 3,
          label: "Child 3",
          parentId: 1,
          parent: {
            ...TEST_FIXTURES.TestIntIdParent,
          },
        },
      ],
    });
    expect(isValidationSuccess(result)).toBe(true);
  });

  it("should reject string id on parent", async () => {
    const ParentValidator = await loadValidator(PARENT_MODEL);
    const result = ParentValidator({
      ...TEST_FIXTURES.TestIntIdParent,
      id: "not-an-int",
    });
    expect(isValidationSuccess(result)).toBe(false);
  });

  it("should reject string foreign key on child", async () => {
    const ChildValidator = await loadValidator(CHILD_MODEL);
    const result = ChildValidator({
      ...TEST_FIXTURES.TestIntIdChild,
      parentId: "not-an-int",
      parent: {
        ...TEST_FIXTURES.TestIntIdParent,
      },
    });
    expect(isValidationSuccess(result)).toBe(false);
  });
});
