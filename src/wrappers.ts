export function wrapPrimitiveWithArray(input: string): string {
  return `${input}[]`;
}

export function wrapObjectWithArray(input: string): string {
  return `type(${input}).array()`;
}

export function wrapWithNullable(input: string): string {
  return `${input} | null`;
}

export function makeUnion(inputModels: string[]): string {
  return inputModels.join(" | ");
}

export function makeIntersection(inputModels: string[]): string {
  return inputModels.join(" & ");
}

export function wrapWithPartial(input: string): string {
  return `Partial<${input}>`;
}

// For object properties, optional is handled by the key name, not the type
export function makeOptionalKey(key: string): string {
  return `${key}?`;
}
