import { type } from "arktype";
import { describe, expect, it } from "vitest";

describe("Select Schema Generation", () => {
  it("should generate UserSelect schema", async () => {
    const { UserSelect } = await import("../prisma/generated/UserSelect");
    expect(UserSelect).toBeDefined();

    const validSelect = {
      id: true,
      email: true,
      name: true,
    };

    const result = UserSelect(validSelect);
    expect(result instanceof type.errors).toBe(false);
  });

  it("should allow partial selection", async () => {
    const { UserSelect } = await import("../prisma/generated/UserSelect");

    const partialSelect = {
      email: true,
    };

    const result = UserSelect(partialSelect);
    expect(result instanceof type.errors).toBe(false);
  });

  it("should include _count field", async () => {
    const { UserSelect } = await import("../prisma/generated/UserSelect");

    const selectWithCount = {
      email: true,
      _count: true,
    };

    const result = UserSelect(selectWithCount);
    expect(result instanceof type.errors).toBe(false);
  });
});

describe("Include Schema Generation", () => {
  it("should generate UserInclude schema", async () => {
    const { UserInclude } = await import("../prisma/generated/UserInclude");
    expect(UserInclude).toBeDefined();

    const validInclude = {
      posts: true,
      profile: true,
    };

    const result = UserInclude(validInclude);
    expect(result instanceof type.errors).toBe(false);
  });

  it("should generate PostInclude schema", async () => {
    const { PostInclude } = await import("../prisma/generated/PostInclude");
    expect(PostInclude).toBeDefined();

    const validInclude = {
      author: true,
      tags: true,
      comments: true,
    };

    const result = PostInclude(validInclude);
    expect(result instanceof type.errors).toBe(false);
  });
});

describe("OrderBy Schema Generation", () => {
  it("should generate UserOrderBy schema", async () => {
    const { UserOrderBy } = await import("../prisma/generated/UserOrderBy");
    expect(UserOrderBy).toBeDefined();

    const validOrderBy = {
      email: "asc",
      createdAt: "desc",
    };

    const result = UserOrderBy(validOrderBy);
    expect(result instanceof type.errors).toBe(false);
  });

  it("should validate sort direction", async () => {
    const { UserOrderBy } = await import("../prisma/generated/UserOrderBy");

    const invalidOrderBy = {
      email: "invalid",
    };

    const result = UserOrderBy(invalidOrderBy);
    expect(result instanceof type.errors).toBe(true);
  });

  it("should generate PostOrderBy schema", async () => {
    const { PostOrderBy } = await import("../prisma/generated/PostOrderBy");
    expect(PostOrderBy).toBeDefined();

    const validOrderBy = {
      title: "asc",
      views: "desc",
    };

    const result = PostOrderBy(validOrderBy);
    expect(result instanceof type.errors).toBe(false);
  });
});
