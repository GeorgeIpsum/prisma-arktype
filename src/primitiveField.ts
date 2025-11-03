import { type Annotation, generateArktypeOptions } from "./annotations";

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
  const options = generateArktypeOptions(annotations);

  switch (type) {
    case "Int":
    case "BigInt":
      return `"number.integer"${options}`;
    case "Float":
    case "Decimal":
      return `"number"${options}`;
    case "String":
      return `"string"${options}`;
    case "DateTime":
      // ArkType uses "Date" for date objects or ISO date strings
      return `"Date"${options}`;
    case "Json":
      return `"unknown"${options}`;
    case "Boolean":
      return `"boolean"${options}`;
    case "Bytes":
      // Bytes can be represented as Buffer in Node.js
      return `"instanceof Buffer"${options}`;
    default:
      throw new Error(`Unsupported primitive type: ${type}`);
  }
}
