import { type } from "arktype";
import { describe, expect, it } from "vitest";
import { StringFilter } from "../src/runtime/stringFilter";

describe("StringFilter Runtime Type", () => {
  it("should accept contains filter", () => {
    const result = StringFilter({ contains: "test" });
    expect(result).toEqual({ contains: "test" });
  });

  it("should accept startsWith filter", () => {
    const result = StringFilter({ startsWith: "prefix" });
    expect(result).toEqual({ startsWith: "prefix" });
  });

  it("should accept endsWith filter", () => {
    const result = StringFilter({ endsWith: "suffix" });
    expect(result).toEqual({ endsWith: "suffix" });
  });

  it("should accept equals filter", () => {
    const result = StringFilter({ equals: "exact" });
    expect(result).toEqual({ equals: "exact" });
  });

  it("should accept in filter with string array", () => {
    const result = StringFilter({ in: ["a", "b", "c"] });
    expect(result).toEqual({ in: ["a", "b", "c"] });
  });

  it("should accept notIn filter with string array", () => {
    const result = StringFilter({ notIn: ["x", "y", "z"] });
    expect(result).toEqual({ notIn: ["x", "y", "z"] });
  });

  it("should accept not filter", () => {
    const result = StringFilter({ not: "excluded" });
    expect(result).toEqual({ not: "excluded" });
  });

  it("should accept gt filter", () => {
    const result = StringFilter({ gt: "a" });
    expect(result).toEqual({ gt: "a" });
  });

  it("should accept gte filter", () => {
    const result = StringFilter({ gte: "a" });
    expect(result).toEqual({ gte: "a" });
  });

  it("should accept lt filter", () => {
    const result = StringFilter({ lt: "z" });
    expect(result).toEqual({ lt: "z" });
  });

  it("should accept lte filter", () => {
    const result = StringFilter({ lte: "z" });
    expect(result).toEqual({ lte: "z" });
  });

  it("should accept multiple filter conditions", () => {
    const result = StringFilter({
      contains: "test",
      startsWith: "t",
      endsWith: "st",
    });

    expect(result).toEqual({
      contains: "test",
      startsWith: "t",
      endsWith: "st",
    });
  });

  it("should reject non-string values in contains", () => {
    const result = StringFilter({ contains: 123 });
    expect(result).toBeInstanceOf(type.errors);
  });

  it("should reject non-array values in 'in' filter", () => {
    const result = StringFilter({ in: "not-an-array" });
    expect(result).toBeInstanceOf(type.errors);
  });

  it("should reject non-string array in 'in' filter", () => {
    const result = StringFilter({ in: [1, 2, 3] });
    expect(result).toBeInstanceOf(type.errors);
  });

  it("should accept empty filter object", () => {
    const result = StringFilter({});
    expect(result).toEqual({});
  });
});
