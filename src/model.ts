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
  needsDateTimeFilter?: boolean; // Whether this model needs DateTimeFilter import
  needsBufferInstance?: boolean; // Whether this model needs BufferInstance import (Prisma v6 and below)
  needsUint8ArrayInstance?: boolean; // Whether this model needs Uint8ArrayInstance import (Prisma v7+)
}
