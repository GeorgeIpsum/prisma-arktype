import { type } from "arktype";
import { describe, expect, it } from "vitest";

describe("Create Input Generation", () => {
  it("should generate UserCreate schema", async () => {
    const { UserCreate } = await import("../prisma/generated/UserCreate");
    expect(UserCreate).toBeDefined();

    // Valid create data (should exclude id, createdAt, updatedAt)
    const validCreate = {
      email: "newuser@example.com",
      name: "New User",
      role: "USER",
      isActive: true,
    };

    const result = UserCreate(validCreate);
    if (result instanceof type.errors) {
      console.log("UserCreate validation failed:", result.summary);
    }
    expect(result instanceof type.errors).toBe(false);
  });

  it("should not require fields with defaults in create", async () => {
    const { UserCreate } = await import("../prisma/generated/UserCreate");

    // Minimal create data
    const minimalCreate = {
      email: "minimal@example.com",
    };

    const result = UserCreate(minimalCreate);
    if (result instanceof type.errors) {
      console.log("UserCreate minimal validation failed:", result.summary);
    }
    expect(result instanceof type.errors).toBe(false);
  });

  it("should generate PostCreate schema", async () => {
    const { PostCreate } = await import("../prisma/generated/PostCreate");
    expect(PostCreate).toBeDefined();

    const validCreate = {
      title: "New Post",
      content: "Post content",
      authorId: "user123",
    };

    const result = PostCreate(validCreate);
    expect(result instanceof type.errors).toBe(false);
  });
});

describe("Update Input Generation", () => {
  it("should generate UserUpdate schema", async () => {
    const { UserUpdate } = await import("../prisma/generated/UserUpdate");
    expect(UserUpdate).toBeDefined();

    // All fields should be optional in update
    const validUpdate = {
      name: "Updated Name",
    };

    const result = UserUpdate(validUpdate);
    expect(result instanceof type.errors).toBe(false);
  });

  it("should allow empty update object", async () => {
    const { UserUpdate } = await import("../prisma/generated/UserUpdate");

    const emptyUpdate = {};
    const result = UserUpdate(emptyUpdate);
    expect(result instanceof type.errors).toBe(false);
  });

  it("should generate PostUpdate schema", async () => {
    const { PostUpdate } = await import("../prisma/generated/PostUpdate");
    expect(PostUpdate).toBeDefined();

    const validUpdate = {
      title: "Updated Title",
      published: true,
    };

    const result = PostUpdate(validUpdate);
    expect(result instanceof type.errors).toBe(false);
  });
});
