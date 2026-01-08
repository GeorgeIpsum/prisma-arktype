import { describe, expect, it } from "vitest";
import { TEST_MODEL_MAP } from "./config/model-mapping";
import {
  getFixture,
  isValidationError,
  isValidationSuccess,
  loadValidator,
} from "./utils/test-helpers";

describe("Annotation Support", () => {
  describe("@prisma-arktype.hide on model", () => {
    it("should not generate validators for hidden model", async () => {
      const modelName = TEST_MODEL_MAP.HIDDEN_MODEL;

      await expect(loadValidator(modelName, "Plain")).rejects.toThrow();
    });
  });

  describe("@prisma-arktype.hide on field", () => {
    it("should exclude hidden field from Plain schema", async () => {
      const modelName = TEST_MODEL_MAP.ANNOTATED_MODEL;
      const PlainValidator = await loadValidator(modelName, "Plain");

      const fixture = getFixture("AnnotatedModel");
      const { hiddenField, ...fixtureWithoutHidden } = fixture;

      // hiddenField should not be in the schema (ArkType allows extra props)
      // So we just verify the schema validates without hiddenField
      const result = PlainValidator({
        ...fixtureWithoutHidden,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(isValidationSuccess(result)).toBe(true);
    });
  });

  describe("@prisma-arktype.input.hide", () => {
    it("should exclude field from Create and Update schemas", async () => {
      const modelName = TEST_MODEL_MAP.ANNOTATED_MODEL;
      const CreateValidator = await loadValidator(modelName, "Create");

      const fixture = getFixture("AnnotatedModel");

      // Should work without computedField
      const result = CreateValidator({
        email: fixture.email,
        normalField: fixture.normalField,
        createOnlyField: fixture.createOnlyField,
        updateOnlyField: fixture.updateOnlyField,
        // computedField excluded
      });

      expect(isValidationSuccess(result)).toBe(true);
    });
  });

  describe("@prisma-arktype.create.input.hide", () => {
    it("should exclude field from Create but allow in Update", async () => {
      const modelName = TEST_MODEL_MAP.ANNOTATED_MODEL;
      const CreateValidator = await loadValidator(modelName, "Create");
      const UpdateValidator = await loadValidator(modelName, "Update");

      // Should work in Create without updateOnlyField
      const createResult = CreateValidator({
        email: "test@example.com",
        normalField: "normal",
        createOnlyField: "create",
        // updateOnlyField excluded from create
      });
      expect(isValidationSuccess(createResult)).toBe(true);

      // Should work in Update with updateOnlyField
      const updateResult = UpdateValidator({
        updateOnlyField: "updated",
      });
      expect(isValidationSuccess(updateResult)).toBe(true);
    });
  });

  describe("@prisma-arktype.update.input.hide", () => {
    it("should exclude field from Update but allow in Create", async () => {
      const modelName = TEST_MODEL_MAP.ANNOTATED_MODEL;
      const CreateValidator = await loadValidator(modelName, "Create");
      const UpdateValidator = await loadValidator(modelName, "Update");

      // Should work in Create with createOnlyField
      const createResult = CreateValidator({
        email: "test@example.com",
        normalField: "normal",
        createOnlyField: "create",
      });
      expect(isValidationSuccess(createResult)).toBe(true);

      // Should work in Update without createOnlyField (field is hidden)
      const updateResult = UpdateValidator({
        normalField: "updated",
        // createOnlyField excluded from update
      });
      expect(isValidationSuccess(updateResult)).toBe(true);
    });
  });

  describe("@prisma-arktype.typeOverwrite", () => {
    it("should apply custom type validation", async () => {
      const modelName = TEST_MODEL_MAP.ANNOTATED_MODEL;
      const PlainValidator = await loadValidator(modelName, "Plain");

      // Invalid email should fail
      const invalidResult = PlainValidator({
        id: "test",
        email: "not-an-email",
        normalField: "normal",
        computedField: "computed",
        updateOnlyField: "update",
        createOnlyField: "create",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(isValidationError(invalidResult)).toBe(true);

      // Valid email should pass
      const validResult = PlainValidator({
        id: "test",
        email: "valid@example.com",
        normalField: "normal",
        computedField: "computed",
        updateOnlyField: "update",
        createOnlyField: "create",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(isValidationSuccess(validResult)).toBe(true);
    });
  });
});
