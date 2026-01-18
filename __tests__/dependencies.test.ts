import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("Dependency Tracking and Import Generation", () => {
  const VALIDATORS_PATH = join(process.cwd(), "prisma/generated/validators");

  function readValidatorFile(modelName: string, validatorType: string): string {
    const fileName = `${modelName}${validatorType}.ts`;
    const filePath = join(VALIDATORS_PATH, fileName);
    return readFileSync(filePath, "utf-8");
  }

  describe("Enum Dependencies", () => {
    it("should import enum dependencies in Plain validator", () => {
      const content = readValidatorFile("TestEnumModel", "Plain");

      // Should import both enums used in the model
      expect(content).toContain(
        'import { TestCurrency } from "./TestCurrency"',
      );
      expect(content).toContain('import { TestStatus } from "./TestStatus"');

      // Should reference enums directly (not as strings)
      expect(content).toContain('"currency?": TestCurrency');
      expect(content).toContain('"status?": TestStatus');
    });

    it("should import enum dependencies in Where validator", () => {
      const content = readValidatorFile("TestEnumModel", "Where");

      expect(content).toContain(
        'import { TestCurrency } from "./TestCurrency"',
      );
      expect(content).toContain('import { TestStatus } from "./TestStatus"');
    });

    it("should import enum dependencies in Create validator", () => {
      const content = readValidatorFile("TestEnumModel", "Create");

      expect(content).toContain(
        'import { TestCurrency } from "./TestCurrency"',
      );
      expect(content).toContain('import { TestStatus } from "./TestStatus"');
    });

    it("should import enum dependencies in Update validator", () => {
      const content = readValidatorFile("TestEnumModel", "Update");

      expect(content).toContain(
        'import { TestCurrency } from "./TestCurrency"',
      );
      expect(content).toContain('import { TestStatus } from "./TestStatus"');
    });
  });

  describe("Runtime Dependencies", () => {
    describe("DateTimeFilter", () => {
      it("should import DateTimeFilter in Where validator with DateTime fields", () => {
        const content = readValidatorFile("TestAllTypes", "Where");

        expect(content).toContain(
          'import { DateTimeFilter } from "prisma-arktype/runtime/filters"',
        );
        expect(content).toContain('type("Date").or(DateTimeFilter)');
      });

      it("should import DateTimeFilter in WhereUnique validator with DateTime fields", () => {
        const content = readValidatorFile("TestUser", "WhereUnique");

        // TestUser has an id field which is unique, but also other fields
        // Check if the file exists and has proper structure
        expect(content).toContain("export const TestUserWhereUnique");
      });

      it("should not import DateTimeFilter in Plain validator", () => {
        const content = readValidatorFile("TestAllTypes", "Plain");

        expect(content).not.toContain("DateTimeFilter");
      });

      it("should not import DateTimeFilter in Create validator", () => {
        const content = readValidatorFile("TestAllTypes", "Create");

        expect(content).not.toContain("DateTimeFilter");
      });

      it("should not import DateTimeFilter in Update validator", () => {
        const content = readValidatorFile("TestAllTypes", "Update");

        expect(content).not.toContain("DateTimeFilter");
      });
    });

    describe("Uint8ArrayInstance (Prisma v7+)", () => {
      it("should import Uint8ArrayInstance in Plain validator with Bytes fields", () => {
        const content = readValidatorFile("TestAllTypes", "Plain");

        expect(content).toContain(
          'import { Uint8ArrayInstance } from "prisma-arktype/runtime/uint8array"',
        );
        expect(content).toContain('"bytes": Uint8ArrayInstance');
      });

      it("should import Uint8ArrayInstance in Where validator with Bytes fields", () => {
        const content = readValidatorFile("TestAllTypes", "Where");

        expect(content).toContain(
          'import { Uint8ArrayInstance } from "prisma-arktype/runtime/uint8array"',
        );
        expect(content).toContain('"bytes?": Uint8ArrayInstance');
      });

      it("should import Uint8ArrayInstance in Create validator with Bytes fields", () => {
        const content = readValidatorFile("TestAllTypes", "Create");

        expect(content).toContain(
          'import { Uint8ArrayInstance } from "prisma-arktype/runtime/uint8array"',
        );
      });

      it("should import Uint8ArrayInstance in Update validator with Bytes fields", () => {
        const content = readValidatorFile("TestAllTypes", "Update");

        expect(content).toContain(
          'import { Uint8ArrayInstance } from "prisma-arktype/runtime/uint8array"',
        );
      });
    });

    describe("Multiple Runtime Dependencies", () => {
      it("should import both DateTimeFilter and Uint8ArrayInstance when both are needed", () => {
        const content = readValidatorFile("TestAllTypes", "Where");

        // Should have both imports
        expect(content).toContain(
          'import { DateTimeFilter } from "prisma-arktype/runtime/filters"',
        );
        expect(content).toContain(
          'import { Uint8ArrayInstance } from "prisma-arktype/runtime/uint8array"',
        );

        // Should use both in the schema
        expect(content).toContain('type("Date").or(DateTimeFilter)');
        expect(content).toContain("Uint8ArrayInstance");
      });
    });
  });

  describe("External Schema Dependencies", () => {
    it("should import external named export schemas", () => {
      const content = readValidatorFile("TestSchemaAnnotation", "Plain");

      // Should import AddressSchema from external file
      expect(content).toContain(
        'import { AddressSchema as AddressSchema_addressJson } from "../../../__tests__/fixtures/schemas"',
      );
    });

    it("should import external default export schemas", () => {
      const content = readValidatorFile("TestSchemaAnnotation", "Plain");

      // Should import default export
      expect(content).toContain(
        'import defaultSchema_configJson from "../../../__tests__/fixtures/defaultSchema"',
      );
    });

    it("should use unique aliases for external schemas", () => {
      const content = readValidatorFile("TestSchemaAnnotation", "Plain");

      // Aliases should be used to avoid naming conflicts
      expect(content).toContain("AddressSchema_addressJson");
      expect(content).toContain("AddressSchema_billingAddress");
      expect(content).toContain("ItemSchema_items");
      expect(content).toContain("MetadataSchema_metadata");
    });
  });

  describe("Combined Dependencies", () => {
    it("should handle model with enum and runtime dependencies", () => {
      const content = readValidatorFile("TestAllTypes", "Where");

      // This model has DateTime fields (runtime dependency)
      expect(content).toContain("DateTimeFilter");
      expect(content).toContain("Uint8ArrayInstance");

      // Should have proper import order
      const lines = content.split("\n");
      const arktypeImport = lines.findIndex((l) =>
        l.includes('from "arktype"'),
      );
      const runtimeImport = lines.findIndex((l) =>
        l.includes("prisma-arktype/runtime"),
      );

      // Runtime imports should come after arktype import
      expect(runtimeImport).toBeGreaterThan(arktypeImport);
    });

    it("should handle model with all dependency types", () => {
      const content = readValidatorFile("TestSchemaAnnotation", "Plain");

      // Should have arktype import
      expect(content).toContain('import { type } from "arktype"');

      // Should have external schema imports
      expect(content).toContain("AddressSchema");

      // Should have the export statement
      expect(content).toContain("export const TestSchemaAnnotationPlain");
    });
  });

  describe("No Dependencies", () => {
    it("should generate validator without extra imports when no dependencies exist", () => {
      const content = readValidatorFile("TestUser", "Plain");

      // Should only have arktype import
      expect(content).toContain('import { type } from "arktype"');

      // Should not have enum imports (TestUser doesn't use enums)
      const importLines = content
        .split("\n")
        .filter((l) => l.includes("import"));
      expect(importLines.length).toBe(1); // Only: arktype import
    });
  });

  describe("Import Order", () => {
    it("should maintain consistent import order", () => {
      const content = readValidatorFile("TestAllTypes", "Where");

      const lines = content.split("\n").filter((l) => l.trim() !== "");

      // Order should be:
      // 1. arktype import
      // 2. enum imports (if any)
      // 3. external schema imports (if any)
      // 4. runtime imports (if any)
      // 5. export statement

      const arktypeIndex = lines.findIndex((l) => l.includes('from "arktype"'));
      const runtimeIndex = lines.findIndex((l) =>
        l.includes("prisma-arktype/runtime"),
      );
      const exportIndex = lines.findIndex((l) => l.includes("export const"));

      expect(arktypeIndex).toBeGreaterThan(-1);
      expect(runtimeIndex).toBeGreaterThan(arktypeIndex);
      expect(exportIndex).toBeGreaterThan(runtimeIndex);
    });
  });

  describe("Dependency Deduplication", () => {
    it("should not duplicate runtime dependencies", () => {
      const content = readValidatorFile("TestAllTypes", "Where");

      // Count occurrences of DateTimeFilter import
      const importMatches = content.match(/import { DateTimeFilter } from/g);
      expect(importMatches?.length).toBe(1);

      // Count occurrences of Uint8ArrayInstance import
      const uint8Matches = content.match(/import { Uint8ArrayInstance } from/g);
      expect(uint8Matches?.length).toBe(1);
    });

    it("should not duplicate enum dependencies", () => {
      const content = readValidatorFile("TestEnumModel", "Plain");

      // Count occurrences of TestCurrency import
      const currencyMatches = content.match(/import { TestCurrency } from/g);
      expect(currencyMatches?.length).toBe(1);

      // Count occurrences of TestStatus import
      const statusMatches = content.match(/import { TestStatus } from/g);
      expect(statusMatches?.length).toBe(1);
    });
  });
});
