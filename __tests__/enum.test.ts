import { type } from "arktype";
import { describe, expect, it } from "vitest";

describe("Enum Generation", () => {
  it("should generate Role enum", async () => {
    const { Role } = await import("../prisma/generated/Role");
    expect(Role).toBeDefined();

    // Test valid values
    const userResult = Role("USER");
    expect(userResult).toBe("USER");

    const adminResult = Role("ADMIN");
    expect(adminResult).toBe("ADMIN");

    const moderatorResult = Role("MODERATOR");
    expect(moderatorResult).toBe("MODERATOR");

    // Test invalid value
    const invalidResult = Role("INVALID");
    expect(invalidResult instanceof type.errors).toBe(true);
  });

  it("should generate Status enum", async () => {
    const { Status } = await import("../prisma/generated/Status");
    expect(Status).toBeDefined();

    const activeResult = Status("ACTIVE");
    expect(activeResult).toBe("ACTIVE");

    const inactiveResult = Status("INACTIVE");
    expect(inactiveResult).toBe("INACTIVE");

    const pendingResult = Status("PENDING");
    expect(pendingResult).toBe("PENDING");
  });
});
