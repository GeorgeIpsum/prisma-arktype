import { describe, expect, it } from "vitest";
import { TEST_MODEL_MAP } from "./config/model-mapping";
import { isValidationSuccess, loadValidator } from "./utils/test-helpers";

describe("Bytes Field Support with Uint8ArrayInstance (Prisma v7+)", () => {
  const MODEL = TEST_MODEL_MAP.ALL_TYPES;

  describe("Plain Validator", () => {
    it("should reject non-Uint8Array for Bytes field", async () => {
      const PlainValidator = await loadValidator(MODEL, "Plain");

      const result = PlainValidator({
        string: "test",
        text: "test",
        int: 42,
        bigInt: BigInt(100),
        float: 3.14,
        decimal: 99.99,
        boolean: true,
        dateTime: new Date(),
        date: new Date(),
        time: new Date(),
        json: {},
        bytes: "not a buffer",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(isValidationSuccess(result)).toBe(false);
    });
  });

  describe("Where Validator", () => {
    it("should accept Buffer in where clause (Buffer extends Uint8Array)", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const testBuffer = Buffer.from("search data");
      const result = WhereValidator({
        bytes: testBuffer,
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept Uint8Array in where clause", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const testUint8Array = new Uint8Array([1, 2, 3, 4, 5]);
      const result = WhereValidator({
        bytes: testUint8Array,
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should reject non-Uint8Array in where clause", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({
        bytes: "not a uint8array",
      });

      expect(isValidationSuccess(result)).toBe(false);
    });

    it("should allow empty where clause", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const result = WhereValidator({});

      expect(isValidationSuccess(result)).toBe(true);
    });
  });

  describe("Update Validator", () => {
    it("should accept Buffer in update input (Buffer extends Uint8Array)", async () => {
      const UpdateValidator = await loadValidator(MODEL, "Update");

      const testBuffer = Buffer.from("update data");
      const result = UpdateValidator({
        bytes: testBuffer,
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should accept Uint8Array in update input", async () => {
      const UpdateValidator = await loadValidator(MODEL, "Update");

      const testUint8Array = new Uint8Array([10, 20, 30, 40]);
      const result = UpdateValidator({
        bytes: testUint8Array,
      });

      expect(isValidationSuccess(result)).toBe(true);
    });

    it("should reject non-Uint8Array in update input", async () => {
      const UpdateValidator = await loadValidator(MODEL, "Update");

      const result = UpdateValidator({
        bytes: { not: "a uint8array" },
      });

      expect(isValidationSuccess(result)).toBe(false);
    });

    it("should allow update without bytes field", async () => {
      const UpdateValidator = await loadValidator(MODEL, "Update");

      const result = UpdateValidator({
        string: "updated string",
      });

      expect(isValidationSuccess(result)).toBe(true);
    });
  });
});
