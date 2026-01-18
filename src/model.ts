export interface ExternalSchemaDependency {
  importPath: string; // Relative path from output directory
  exportName?: string; // Named export (if provided)
  localAlias: string; // Unique local name to use in code
}

/**
 * Runtime dependencies are built-in runtime schemas provided by prisma-arktype
 * (e.g., DateTimeFilter, BufferInstance, Uint8ArrayInstance)
 */
export type RuntimeDependency =
  | "DateTimeFilter"
  | "BufferInstance"
  | "Uint8ArrayInstance";

export interface ProcessedModel {
  name: string;
  stringified: string;
  enumDependencies?: string[]; // Enum types that this model references
  modelDependencies?: string[]; // Model Plain types that this model references
  externalSchemaDependencies?: ExternalSchemaDependency[]; // External schema imports
  runtimeDependencies?: RuntimeDependency[]; // Built-in runtime schemas that this model needs
}
