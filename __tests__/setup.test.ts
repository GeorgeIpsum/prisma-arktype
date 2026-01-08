import { access } from "node:fs/promises";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

const GENERATED_PATH = join(__dirname, "../prisma/generated");

describe("Generator Setup", () => {
  beforeAll(async () => {
    // Verify that prisma generate has been run
    try {
      await access(GENERATED_PATH);
    } catch {
      throw new Error(
        "Generated files not found. Run 'prisma generate' before running tests.",
      );
    }
  });

  it("should create the generated directory", async () => {
    await expect(access(GENERATED_PATH)).resolves.toBeUndefined();
  });

  it("should have generated validators directory", async () => {
    const validatorsPath = join(__dirname, "../prisma/generated/validators");
    await expect(access(validatorsPath)).resolves.toBeUndefined();
  });
});
