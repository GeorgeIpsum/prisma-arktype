export interface ExternalSchemaDependency {
  importPath: string; // Relative path from output directory
  exportName?: string; // Named export (if provided)
  localAlias: string; // Unique local name to use in code
}

export interface ProcessedModel {
  name: string;
  stringified: string;
  enumDependencies?: string[]; // Enum types that this model references
  modelDependencies?: string[]; // Model Plain types that this model references
  externalSchemaDependencies?: ExternalSchemaDependency[]; // External schema imports
}
