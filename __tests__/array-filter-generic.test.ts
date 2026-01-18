import { type } from "arktype";
import { describe, expect, it } from "vitest";
import { arrayFilter } from "../src/runtime/arrayFilters";

describe("Generic arrayFilter", () => {
  it("should create a string array filter", () => {
    const StringFilter = arrayFilter("string");

    const validResult = StringFilter({ has: "test" });
    expect(validResult).toEqual({ has: "test" });

    const invalidResult = StringFilter({ has: 123 });
    expect(invalidResult).toBeInstanceOf(type.errors);
  });

  it("should create a number array filter", () => {
    const NumberFilter = arrayFilter("number");

    const validResult = NumberFilter({ hasEvery: [1, 2, 3] });
    expect(validResult).toEqual({ hasEvery: [1, 2, 3] });

    const invalidResult = NumberFilter({ has: "not-a-number" });
    expect(invalidResult).toBeInstanceOf(type.errors);
  });

  it("should support all filter operations", () => {
    const Filter = arrayFilter("string");

    // isEmpty
    expect(Filter({ isEmpty: true })).toEqual({ isEmpty: true });

    // has
    expect(Filter({ has: "value" })).toEqual({ has: "value" });

    // hasEvery
    expect(Filter({ hasEvery: ["a", "b"] })).toEqual({
      hasEvery: ["a", "b"],
    });

    // hasSome
    expect(Filter({ hasSome: ["x", "y"] })).toEqual({
      hasSome: ["x", "y"],
    });

    // equals
    expect(Filter({ equals: ["1", "2", "3"] })).toEqual({
      equals: ["1", "2", "3"],
    });
  });

  it("should support combining multiple filter operations", () => {
    const Filter = arrayFilter("number");

    const result = Filter({
      has: 5,
      isEmpty: false,
    });

    expect(result).toEqual({
      has: 5,
      isEmpty: false,
    });
  });
});
