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
        billingAddress: fixture.billingAddress,
        configJson: fixture.configJson,
        emailWithSchema: fixture.emailWithSchema,
        items: fixture.items,
        metadata: fixture.metadata,
        age: fixture.age,
        isActive: fixture.isActive,
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

  describe("Alias collision prevention", () => {
    it("should generate unique aliases for multiple fields using same schema", async () => {
      const PlainValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Plain",
      );
      const fixture = getFixture("TestSchemaAnnotation");

      // Both addressJson and billingAddress use AddressSchema
      // Should generate unique aliases: AddressSchema_addressJson, AddressSchema_billingAddress
      const validResult = PlainValidator(fixture);

      expect(isValidationSuccess(validResult)).toBe(true);
    });

    it("should validate each field independently with same schema", async () => {
      const PlainValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Plain",
      );
      const fixture = getFixture("TestSchemaAnnotation");

      // Invalid addressJson should fail
      const invalidAddress = PlainValidator({
        ...fixture,
        addressJson: {
          street: "123 Main St",
          // missing city, zipCode, country
        },
      });

      expect(isValidationError(invalidAddress)).toBe(true);

      // Invalid billingAddress should fail
      const invalidBilling = PlainValidator({
        ...fixture,
        billingAddress: {
          street: "456 Billing Ave",
          city: "Cambridge",
          // missing zipCode, country
        },
      });

      expect(isValidationError(invalidBilling)).toBe(true);
    });
  });

  describe("Schema on different field types", () => {
    it("should work on Int fields with number constraints", async () => {
      const PlainValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Plain",
      );
      const fixture = getFixture("TestSchemaAnnotation");

      const validResult = PlainValidator(fixture);
      expect(isValidationSuccess(validResult)).toBe(true);

      // Test constraint: age must be between 0 and 150
      const tooYoung = PlainValidator({
        ...fixture,
        age: -1,
      });
      expect(isValidationError(tooYoung)).toBe(true);

      const tooOld = PlainValidator({
        ...fixture,
        age: 151,
      });
      expect(isValidationError(tooOld)).toBe(true);

      const validAge = PlainValidator({
        ...fixture,
        age: 75,
      });
      expect(isValidationSuccess(validAge)).toBe(true);
    });

    it("should work on Boolean fields", async () => {
      const PlainValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Plain",
      );
      const fixture = getFixture("TestSchemaAnnotation");

      const validTrue = PlainValidator({
        ...fixture,
        isActive: true,
      });
      expect(isValidationSuccess(validTrue)).toBe(true);

      const validFalse = PlainValidator({
        ...fixture,
        isActive: false,
      });
      expect(isValidationSuccess(validFalse)).toBe(true);

      const invalidBoolean = PlainValidator({
        ...fixture,
        isActive: "true", // string instead of boolean
      });
      expect(isValidationError(invalidBoolean)).toBe(true);
    });

    it("should work on DateTime fields", async () => {
      const PlainValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Plain",
      );
      const fixture = getFixture("TestSchemaAnnotation");

      const validResult = PlainValidator(fixture);
      expect(isValidationSuccess(validResult)).toBe(true);

      const invalidDate = PlainValidator({
        ...fixture,
        createdAt: "2024-01-01", // string instead of Date
      });
      expect(isValidationError(invalidDate)).toBe(true);

      const validDate = PlainValidator({
        ...fixture,
        createdAt: new Date(),
      });
      expect(isValidationSuccess(validDate)).toBe(true);
    });

    it("should work on String fields with custom constraints", async () => {
      const PlainValidator = await loadValidator(
        "TestSchemaAnnotation",
        "Plain",
      );
      const fixture = getFixture("TestSchemaAnnotation");

      // emailWithSchema uses "string.email" constraint
      const validEmail = PlainValidator(fixture);
      expect(isValidationSuccess(validEmail)).toBe(true);

      const invalidEmail = PlainValidator({
        ...fixture,
        emailWithSchema: "not-an-email",
      });
      expect(isValidationError(invalidEmail)).toBe(true);
    });
  });
});
