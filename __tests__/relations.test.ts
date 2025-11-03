import { describe, expect, it } from "vitest";

describe("Relations Generation", () => {
  it("should generate UserRelations schema", async () => {
    const { UserRelations } = await import("../prisma/generated/UserRelations");
    expect(UserRelations).toBeDefined();
  });

  it("should generate PostRelations schema", async () => {
    const { PostRelations } = await import("../prisma/generated/PostRelations");
    expect(PostRelations).toBeDefined();
  });

  it("should generate combined User schema", async () => {
    const { User } = await import("../prisma/generated/User");
    expect(User).toBeDefined();
  });

  it("should generate combined Post schema", async () => {
    const { Post } = await import("../prisma/generated/Post");
    expect(Post).toBeDefined();
  });
});
