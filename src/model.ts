export interface ProcessedModel {
  name: string;
  stringified: string;
  enumDependencies?: string[]; // Enum types that this model references
}
