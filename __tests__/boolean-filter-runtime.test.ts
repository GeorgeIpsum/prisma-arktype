import { type } from "arktype";
import { describe, expect, it } from "vitest";
import { BooleanFilter } from "../src/runtime/booleanFilter";

describe("BooleanFilter Runtime Type", () => {
  it("should accept equals: true", () => {
    const result = BooleanFilter({ equals: true });
    expect(result).toEqual({ equals: true });
  });

  it("should accept equals: false", () => {
    const result = BooleanFilter({ equals: false });
    expect(result).toEqual({ equals: false });
  });

  it("should accept not: true", () => {
    const result = BooleanFilter({ not: true });
    expect(result).toEqual({ not: true });
  });

  it("should accept not: false", () => {
    const result = BooleanFilter({ not: false });
    expect(result).toEqual({ not: false });
  });

  it("should accept both equals and not", () => {
    const result = BooleanFilter({ equals: true, not: false });
    expect(result).toEqual({ equals: true, not: false });
  });

  it("should accept empty object", () => {
    const result = BooleanFilter({});
    expect(result).toEqual({});
  });

  it("should reject non-boolean value in equals", () => {
    const result = BooleanFilter({ equals: "true" });
    expect(result).toBeInstanceOf(type.errors);
  });

  it("should reject number in equals", () => {
    const result = BooleanFilter({ equals: 1 });
    expect(result).toBeInstanceOf(type.errors);
  });

  it("should reject non-boolean value in not", () => {
    const result = BooleanFilter({ not: "false" });
    expect(result).toBeInstanceOf(type.errors);
  });

  it("should reject number in not", () => {
    const result = BooleanFilter({ not: 0 });
    expect(result).toBeInstanceOf(type.errors);
  });

  it("should reject array values in equals", () => {
    const result = BooleanFilter({ equals: [true] });
    expect(result).toBeInstanceOf(type.errors);
  });

  it("should reject object values in equals", () => {
    const result = BooleanFilter({ equals: {} });
    expect(result).toBeInstanceOf(type.errors);
  });
});
