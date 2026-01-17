import { type } from "arktype";
import { describe, expect, it } from "vitest";
import {
  getFixture,
  isValidationError,
  isValidationSuccess,
  loadValidator,
} from "./utils/test-helpers";

describe("Schema Annotation Support", () => {
  describe("Inline schemas", () => {
    it("should validate inline schema for Json field", async () => {
      const PlainValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Plain",
      );
      const fixture = getFixture("TestSchemaAnnotation");

      const validResult = PlainValidator(fixture);

      expect(isValidationSuccess(validResult)).toBe(true);
    });

    it("should reject invalid data for inline schema", async () => {
      const PlainValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Plain",
      );

      const invalidResult = PlainValidator({
        id: "test",
        inlineJson: { name: "John", age: "thirty" }, // age should be number
      });

      expect(isValidationError(invalidResult)).toBe(true);
    });
  });

  describe("External named export schemas", () => {
    it("should import and use external named export schema", async () => {
      const PlainValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Plain",
      );
      const fixture = getFixture("TestSchemaAnnotation");

      const validResult = PlainValidator(fixture);

      expect(isValidationSuccess(validResult)).toBe(true);
    });

    it("should reject invalid data for external named export schema", async () => {
      const PlainValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Plain",
      );

      const invalidResult = PlainValidator({
        id: "test",
        addressJson: {
          street: "123 Main St",
          city: "Boston",
          // missing zipCode and country
        },
      });

      expect(isValidationError(invalidResult)).toBe(true);
    });
  });

  describe("External default export schemas", () => {
    it("should import and use external default export schema", async () => {
      const PlainValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Plain",
      );
      const fixture = getFixture("TestSchemaAnnotation");

      const validResult = PlainValidator(fixture);

      expect(isValidationSuccess(validResult)).toBe(true);
    });

    it("should reject invalid data for external default export schema", async () => {
      const PlainValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Plain",
      );

      const invalidResult = PlainValidator({
        id: "test",
        configJson: {
          theme: "invalid", // should be 'light' or 'dark'
          language: "en",
        },
      });

      expect(isValidationError(invalidResult)).toBe(true);
    });
  });

  describe("Priority over typeOverwrite", () => {
    it("should use schema annotation when both schema and typeOverwrite present", async () => {
      const PlainValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Plain",
      );
      const fixture = getFixture("TestSchemaAnnotation");

      // Should validate as email (from schema), not as string (from typeOverwrite)
      const invalidEmail = PlainValidator({
        ...fixture,
        emailWithSchema: "not-an-email",
      });

      expect(isValidationError(invalidEmail)).toBe(true);

      const validEmail = PlainValidator(fixture);

      expect(isValidationSuccess(validEmail)).toBe(true);
    });
  });

  describe("Array fields with external schemas", () => {
    it("should apply array() wrapper to external schemas", async () => {
      const PlainValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Plain",
      );
      const fixture = getFixture("TestSchemaAnnotation");

      const validResult = PlainValidator(fixture);

      expect(isValidationSuccess(validResult)).toBe(true);
    });

    it("should reject invalid array items", async () => {
      const PlainValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Plain",
      );

      const invalidResult = PlainValidator({
        id: "test",
        items: [
          { id: "item1", quantity: 5 },
          { id: "item2", quantity: "invalid" }, // should be number
        ],
      });

      expect(isValidationError(invalidResult)).toBe(true);
    });
  });

  describe("Optional fields with external schemas", () => {
    it("should accept null for optional external schema field", async () => {
      const PlainValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Plain",
      );
      const fixture = getFixture("TestSchemaAnnotation");

      const withNull = PlainValidator({
        ...fixture,
        metadata: null,
      });

      expect(isValidationSuccess(withNull)).toBe(true);
    });

    it("should accept valid data for optional external schema field", async () => {
      const PlainValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Plain",
      );
      const fixture = getFixture("TestSchemaAnnotation");

      const withValue = PlainValidator(fixture);

      expect(isValidationSuccess(withValue)).toBe(true);
    });

    it("should reject invalid data for optional external schema field", async () => {
      const PlainValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Plain",
      );

      const invalidResult = PlainValidator({
        id: "test",
        metadata: { key: "foo" }, // missing 'value' field
      });

      expect(isValidationError(invalidResult)).toBe(true);
    });
  });

  describe("Create and Update inputs", () => {
    it("should work with Create inputs", async () => {
      const CreateValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Create",
      );
      const fixture = getFixture("TestSchemaAnnotation");

      const validResult = CreateValidator({
        inlineJson: fixture.inlineJson,
        addressJson: fixture.addressJson,
        configJson: fixture.configJson,
        emailWithSchema: fixture.emailWithSchema,
        items: fixture.items,
        metadata: fixture.metadata,
      });

      expect(isValidationSuccess(validResult)).toBe(true);
    });

    it("should work with Update inputs", async () => {
      const UpdateValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Update",
      );

      const validResult = UpdateValidator({
        inlineJson: { name: "Jane Doe", age: 25 },
      });

      expect(isValidationSuccess(validResult)).toBe(true);
    });
  });

  describe("Where clauses", () => {
    it("should work with Where clauses", async () => {
      const WhereValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Where",
      );

      const validResult = WhereValidator({
        emailWithSchema: "test@example.com",
      });

      expect(isValidationSuccess(validResult)).toBe(true);
    });

    it("should work with WhereUnique clauses", async () => {
      const WhereUniqueValidator = await loadValidator(
        "TestSchemaAnnotation",
        "WhereUnique",
      );

      const validResult = WhereUniqueValidator({
        id: "test_id",
      });

      expect(isValidationSuccess(validResult)).toBe(true);
    });
  });
});
