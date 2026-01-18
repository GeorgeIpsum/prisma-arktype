import { type } from "arktype";
import { describe, expect, it } from "vitest";
import { IntFilter, NumberFilter } from "../src/runtime/numberFilter";

describe("NumberFilter Runtime Type", () => {
  it("should accept equals filter", () => {
    const result = NumberFilter({ equals: 42.5 });
    expect(result).toEqual({ equals: 42.5 });
  });

  it("should accept gt filter", () => {
    const result = NumberFilter({ gt: 10.5 });
    expect(result).toEqual({ gt: 10.5 });
  });

  it("should accept gte filter", () => {
    const result = NumberFilter({ gte: 20.0 });
    expect(result).toEqual({ gte: 20.0 });
  });

  it("should accept lt filter", () => {
    const result = NumberFilter({ lt: 100.99 });
    expect(result).toEqual({ lt: 100.99 });
  });

  it("should accept lte filter", () => {
    const result = NumberFilter({ lte: 50.5 });
    expect(result).toEqual({ lte: 50.5 });
  });

  it("should accept in filter with number array", () => {
    const result = NumberFilter({ in: [1.5, 2.5, 3.5] });
    expect(result).toEqual({ in: [1.5, 2.5, 3.5] });
  });

  it("should accept notIn filter with number array", () => {
    const result = NumberFilter({ notIn: [0.0, 1.0, 2.0] });
    expect(result).toEqual({ notIn: [0.0, 1.0, 2.0] });
  });

  it("should accept not filter", () => {
    const result = NumberFilter({ not: 99.99 });
    expect(result).toEqual({ not: 99.99 });
  });

  it("should accept multiple filter conditions", () => {
    const result = NumberFilter({
      gte: 10.5,
      lte: 100.5,
      not: 50.0,
    });

    expect(result).toEqual({
      gte: 10.5,
      lte: 100.5,
      not: 50.0,
    });
  });

  it("should reject non-number values", () => {
    const result = NumberFilter({ equals: "not-a-number" });
    expect(result).toBeInstanceOf(type.errors);
  });

  it("should reject non-array values in 'in' filter", () => {
    const result = NumberFilter({ in: "not-an-array" });
    expect(result).toBeInstanceOf(type.errors);
  });

  it("should accept empty filter object", () => {
    const result = NumberFilter({});
    expect(result).toEqual({});
  });
});

describe("IntFilter Runtime Type", () => {
  it("should accept equals filter with integer", () => {
    const result = IntFilter({ equals: 42 });
    expect(result).toEqual({ equals: 42 });
  });

  it("should accept gt filter", () => {
    const result = IntFilter({ gt: 10 });
    expect(result).toEqual({ gt: 10 });
  });

  it("should accept gte filter", () => {
    const result = IntFilter({ gte: 20 });
    expect(result).toEqual({ gte: 20 });
  });

  it("should accept lt filter", () => {
    const result = IntFilter({ lt: 100 });
    expect(result).toEqual({ lt: 100 });
  });

  it("should accept lte filter", () => {
    const result = IntFilter({ lte: 50 });
    expect(result).toEqual({ lte: 50 });
  });

  it("should accept in filter with integer array", () => {
    const result = IntFilter({ in: [1, 2, 3, 4, 5] });
    expect(result).toEqual({ in: [1, 2, 3, 4, 5] });
  });

  it("should accept notIn filter with integer array", () => {
    const result = IntFilter({ notIn: [0, -1, -2] });
    expect(result).toEqual({ notIn: [0, -1, -2] });
  });

  it("should accept not filter", () => {
    const result = IntFilter({ not: 99 });
    expect(result).toEqual({ not: 99 });
  });

  it("should accept multiple filter conditions", () => {
    const result = IntFilter({
      gte: 10,
      lte: 100,
      not: 50,
    });

    expect(result).toEqual({
      gte: 10,
      lte: 100,
      not: 50,
    });
  });

  it("should reject non-integer values (floats)", () => {
    const result = IntFilter({ equals: 3.14 });
    expect(result).toBeInstanceOf(type.errors);
  });

  it("should reject non-integer array in 'in' filter", () => {
    const result = IntFilter({ in: [1.5, 2.5, 3.5] });
    expect(result).toBeInstanceOf(type.errors);
  });

  it("should reject string values", () => {
    const result = IntFilter({ equals: "not-a-number" });
    expect(result).toBeInstanceOf(type.errors);
  });

  it("should accept empty filter object", () => {
    const result = IntFilter({});
    expect(result).toEqual({});
  });
});
