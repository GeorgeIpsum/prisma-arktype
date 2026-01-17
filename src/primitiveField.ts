import type { Annotation } from "./annotations";

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
      // Bytes is represented as Buffer in Node.js (which extends Uint8Array)
      // Use unknown since binary data validation is uncommon in queries
      return `"unknown"`;
    default:
      throw new Error(`Unsupported primitive type: ${type}`);
  }
}
