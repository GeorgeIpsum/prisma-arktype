import { type } from "arktype";
import { describe, expect, it } from "vitest";

describe("Where Clause Generation", () => {
  it("should generate UserWhere schema", async () => {
    const { UserWhere } = await import("../prisma/generated/UserWhere");
    expect(UserWhere).toBeDefined();

    // Valid where clause
    const validWhere = {
      email: "test@example.com",
      isActive: true,
    };

    const result = UserWhere(validWhere);
    expect(result instanceof type.errors).toBe(false);
  });

  it("should allow empty where clause", async () => {
    const { UserWhere } = await import("../prisma/generated/UserWhere");

    const emptyWhere = {};
    const result = UserWhere(emptyWhere);
    expect(result instanceof type.errors).toBe(false);
  });

  it("should generate UserWhereUnique schema", async () => {
    const { UserWhereUnique } = await import(
      "../prisma/generated/UserWhereUnique"
    );
    expect(UserWhereUnique).toBeDefined();

    // Valid unique where clause
    const validWhereUnique = {
      id: "user123",
    };

    const result = UserWhereUnique(validWhereUnique);
    expect(result instanceof type.errors).toBe(false);
  });

  it("should validate WhereUnique with email", async () => {
    const { UserWhereUnique } = await import(
      "../prisma/generated/UserWhereUnique"
    );

    const whereByEmail = {
      email: "test@example.com",
    };

    const result = UserWhereUnique(whereByEmail);
    expect(result instanceof type.errors).toBe(false);
  });

  it("should generate PostWhere schema", async () => {
    const { PostWhere } = await import("../prisma/generated/PostWhere");
    expect(PostWhere).toBeDefined();

    const validWhere = {
      published: true,
      authorId: "user123",
    };

    const result = PostWhere(validWhere);
    expect(result instanceof type.errors).toBe(false);
  });
});
