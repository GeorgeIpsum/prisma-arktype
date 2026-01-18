import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { Annotation } from "./annotations";

// Create a require function for ESM context
const require = createRequire(import.meta.url);

/**
 * Determines if the current Prisma version is v7 or higher.
 * In Prisma v7+, Bytes fields return Uint8Array instead of Buffer.
 */
function isPrismaV7OrHigher(): boolean {
  try {
    // Read @prisma/client package.json to get version without importing it
    const prismaClientPath = require.resolve("@prisma/client");
    // The resolved path is typically .../node_modules/@prisma/client/default.js
    // We need to get the package.json from .../node_modules/@prisma/client/package.json
    const clientDir = dirname(prismaClientPath);
    const packageJsonPath = join(clientDir, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    const version = packageJson.version;
    const majorVersion = Number.parseInt(version.split(".")[0], 10);
    return majorVersion >= 7;
  } catch {
    // If we can't determine the version, default to v6 behavior (BufferInstance)
    return false;
  }
}

// Cache the Prisma version check result at module level to avoid repeated file I/O
const IS_PRISMA_V7_OR_HIGHER = isPrismaV7OrHigher();

const primitiveTypes = [
  "Int",
  "BigInt",
  "Float",
  "Decimal",
  "String",
  "DateTime",
  "Json",
  "Boolean",
  "Bytes",
] as const;

export type PrimitiveFieldType = (typeof primitiveTypes)[number];

export function isPrimitivePrismaFieldType(
  type: string,
): type is PrimitiveFieldType {
  return primitiveTypes.includes(type as PrimitiveFieldType);
}

export function stringifyPrimitiveType(
  type: PrimitiveFieldType,
  annotations: Annotation[],
): string {
  switch (type) {
    case "Int":
    case "BigInt":
      return `"number.integer"`;
    case "Float":
    case "Decimal":
      return `"number"`;
    case "String":
      return `"string"`;
    case "DateTime":
      // ArkType uses "Date" for date objects or ISO date strings
      return `"Date"`;
    case "Json":
      return `"unknown"`;
    case "Boolean":
      return `"boolean"`;
    case "Bytes":
      // Prisma v6 and below: Bytes returns as Buffer
      // Prisma v7+: Bytes returns as Uint8Array
      if (IS_PRISMA_V7_OR_HIGHER) {
        return "Uint8ArrayInstance";
      }
      return "BufferInstance";
    default:
      throw new Error(`Unsupported primitive type: ${type}`);
  }
}
