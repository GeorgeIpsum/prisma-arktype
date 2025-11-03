import { type } from "arktype";
import { describe, expect, it } from "vitest";

describe("Plain Model Generation", () => {
  it("should generate UserPlain schema", async () => {
    const { UserPlain } = await import("../prisma/generated/UserPlain");
    expect(UserPlain).toBeDefined();

    // Test valid user plain data
    const validData = {
      id: "user123",
      email: "test@example.com",
      name: "Test User",
      age: 25,
      role: "USER",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = UserPlain(validData);
    expect(result instanceof type.errors).toBe(false);
    if (!(result instanceof type.errors)) {
      expect(result.email).toBe(validData.email);
      expect(result.name).toBe(validData.name);
    }
  });

  it("should validate UserPlain required fields", async () => {
    const { UserPlain } = await import("../prisma/generated/UserPlain");

    // Missing required fields
    const invalidData = {
      name: "Test User",
    };

    const result = UserPlain(invalidData);
    expect(result instanceof type.errors).toBe(true);
  });

  it("should generate PostPlain schema", async () => {
    const { PostPlain } = await import("../prisma/generated/PostPlain");
    expect(PostPlain).toBeDefined();

    const validPost = {
      id: "post123",
      title: "Test Post",
      content: "This is a test post",
      published: false,
      views: 100,
      authorId: "user123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = PostPlain(validPost);
    expect(result instanceof type.errors).toBe(false);
  });

  it("should handle optional fields", async () => {
    const { UserPlain } = await import("../prisma/generated/UserPlain");

    const dataWithoutOptionals = {
      id: "user123",
      email: "test@example.com",
      role: "USER",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = UserPlain(dataWithoutOptionals);
    if (result instanceof type.errors) {
      console.log("UserPlain validation failed:", result.summary);
    }
    expect(result instanceof type.errors).toBe(false);
  });

  it("should validate types correctly", async () => {
    const { PostPlain } = await import("../prisma/generated/PostPlain");

    // Wrong type for views (should be integer)
    const invalidPost = {
      id: "post123",
      title: "Test Post",
      content: "This is a test post",
      published: false,
      views: "not a number",
      authorId: "user123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = PostPlain(invalidPost);
    expect(result instanceof type.errors).toBe(true);
  });
});
