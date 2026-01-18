import { type } from "arktype";
import { describe, expect, it } from "vitest";
import { enumFilter } from "../src/runtime/enumFilter";

describe("enumFilter Runtime Type", () => {
  // Create a test enum
  const TestEnum = type("'VALUE_A' | 'VALUE_B' | 'VALUE_C'");

  it("should accept equals filter", () => {
    const Filter = enumFilter(TestEnum);
    const result = Filter({ equals: "VALUE_A" });
    expect(result).toEqual({ equals: "VALUE_A" });
  });

  it("should accept in filter with enum array", () => {
    const Filter = enumFilter(TestEnum);
    const result = Filter({ in: ["VALUE_A", "VALUE_B"] });
    expect(result).toEqual({ in: ["VALUE_A", "VALUE_B"] });
  });

  it("should accept notIn filter with enum array", () => {
    const Filter = enumFilter(TestEnum);
    const result = Filter({ notIn: ["VALUE_C"] });
    expect(result).toEqual({ notIn: ["VALUE_C"] });
  });

  it("should accept not filter", () => {
    const Filter = enumFilter(TestEnum);
    const result = Filter({ not: "VALUE_B" });
    expect(result).toEqual({ not: "VALUE_B" });
  });

  it("should accept multiple filter conditions", () => {
    const Filter = enumFilter(TestEnum);
    const result = Filter({
      in: ["VALUE_A", "VALUE_B"],
      not: "VALUE_C",
    });

    expect(result).toEqual({
      in: ["VALUE_A", "VALUE_B"],
      not: "VALUE_C",
    });
  });

  it("should reject invalid enum value in equals", () => {
    const Filter = enumFilter(TestEnum);
    const result = Filter({ equals: "INVALID_VALUE" });
    expect(result).toBeInstanceOf(type.errors);
  });

  it("should reject invalid enum values in 'in' filter", () => {
    const Filter = enumFilter(TestEnum);
    const result = Filter({ in: ["VALUE_A", "INVALID"] });
    expect(result).toBeInstanceOf(type.errors);
  });

  it("should reject non-array in 'in' filter", () => {
    const Filter = enumFilter(TestEnum);
    const result = Filter({ in: "VALUE_A" });
    expect(result).toBeInstanceOf(type.errors);
  });

  it("should accept empty filter object", () => {
    const Filter = enumFilter(TestEnum);
    const result = Filter({});
    expect(result).toEqual({});
  });

  describe("with numeric enum", () => {
    const NumericEnum = type("1 | 2 | 3");

    it("should accept equals filter with numeric value", () => {
      const Filter = enumFilter(NumericEnum);
      const result = Filter({ equals: 1 });
      expect(result).toEqual({ equals: 1 });
    });

    it("should accept in filter with numeric array", () => {
      const Filter = enumFilter(NumericEnum);
      const result = Filter({ in: [1, 2] });
      expect(result).toEqual({ in: [1, 2] });
    });

    it("should reject invalid numeric value", () => {
      const Filter = enumFilter(NumericEnum);
      const result = Filter({ equals: 99 });
      expect(result).toBeInstanceOf(type.errors);
    });
  });
});
