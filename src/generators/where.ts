import type { DMMF } from "@prisma/generator-helper";
import { extractAnnotations, isSchema, isTypeOverwrite } from "../annotations";
import {
  isPrimitivePrismaFieldType,
  stringifyPrimitiveType,
} from "../primitiveField";
import { wrapPrimitiveWithArray } from "../wrappers";
import { processedEnums } from "./enum";
import type { ExternalSchemaDependency, ProcessedModel } from "../model";

export const processedWhere: ProcessedModel[] = [];
export const processedWhereUnique: ProcessedModel[] = [];

export function processWhere(
  models: DMMF.Model[] | Readonly<DMMF.Model[]>,
): void {
  for (const model of models) {
    const result = stringifyWhere(model);
    if (result) {
      processedWhere.push({
        name: model.name,
        stringified: result.stringified,
        enumDependencies: result.enumDependencies,
        externalSchemaDependencies: result.externalSchemaDependencies,
      });
    }

    const uniqueResult = stringifyWhereUnique(model);
    if (uniqueResult) {
      processedWhereUnique.push({
        name: model.name,
        stringified: uniqueResult.stringified,
        enumDependencies: uniqueResult.enumDependencies,
        externalSchemaDependencies: uniqueResult.externalSchemaDependencies,
      });
    }
  }
  Object.freeze(processedWhere);
  Object.freeze(processedWhereUnique);
}

const enumMatch = /type\("(.+)"\)/;

function stringifyWhere(model: DMMF.Model):
  | {
      stringified: string;
      enumDependencies: string[];
      externalSchemaDependencies: ExternalSchemaDependency[];
    }
  | undefined {
  const { annotations: modelAnnotations, hidden } = extractAnnotations(
    model.documentation,
  );

  if (hidden) {
    return;
  }

  const fields: string[] = [];
  const enumDependencies: string[] = [];
  const externalSchemaDependencies: ExternalSchemaDependency[] = [];

  // Helper function for generating unique aliases
  function generateUniqueAlias(
    path: string,
    exportName?: string,
    fieldName?: string,
  ): string {
    const baseName =
      exportName ||
      path
        .split("/")
        .pop()
        ?.replace(/\.(ts|js)$/, "") ||
      "Schema";
    const suffix = fieldName ? `_${fieldName}` : "";
    return `${baseName}${suffix}`;
  }

  for (const field of model.fields) {
    const { annotations: fieldAnnotations, hidden: fieldHidden } =
      extractAnnotations(field.documentation);

    if (fieldHidden) continue;
    if (field.kind === "object") continue; // Skip relations

    const schemaAnnotation = fieldAnnotations.find(isSchema);
    const typeOverwrite = fieldAnnotations.find(isTypeOverwrite);
    let fieldType: string;

    if (schemaAnnotation) {
      // HIGHEST PRIORITY: schema annotation
      if (schemaAnnotation.isExternal) {
        // External schema - generate alias and track dependency
        const alias = generateUniqueAlias(
          schemaAnnotation.importPath!,
          schemaAnnotation.exportName,
          field.name,
        );
        if (!externalSchemaDependencies.some((d) => d.localAlias === alias)) {
          const dependency: ExternalSchemaDependency = {
            importPath: schemaAnnotation.importPath!,
            localAlias: alias,
          };
          if (schemaAnnotation.exportName) {
            dependency.exportName = schemaAnnotation.exportName;
          }
          externalSchemaDependencies.push(dependency);
        }
        fieldType = alias;
      } else {
        // Inline schema - use directly
        // Object schemas ({ ... }) should not be quoted
        // Simple type strings should be quoted
        if (schemaAnnotation.value.trim().startsWith("{")) {
          fieldType = schemaAnnotation.value;
        } else {
          fieldType = `"${schemaAnnotation.value}"`;
        }
      }
    } else if (typeOverwrite) {
      fieldType = typeOverwrite.value;
    } else if (isPrimitivePrismaFieldType(field.type)) {
      fieldType = stringifyPrimitiveType(field.type, fieldAnnotations);
    } else if (field.kind === "enum") {
      const enumDef = processedEnums.find((e) => e.name === field.type);
      if (!enumDef) continue;

      // Track this enum as a dependency
      if (!enumDependencies.includes(field.type)) {
        enumDependencies.push(field.type);
      }

      // Reference the enum by name
      fieldType = field.type;
    } else {
      continue;
    }

    const isEnumType =
      field.kind === "enum" && !typeOverwrite && !schemaAnnotation;
    const isExternalSchema = schemaAnnotation?.isExternal === true;

    if (field.isList) {
      if (isExternalSchema || isEnumType) {
        fieldType = `${fieldType}.array()`;
      } else {
        const inner = fieldType.slice(1, -1);
        fieldType = `"${wrapPrimitiveWithArray(inner)}"`;
      }
    }

    // All where fields are optional
    fields.push(`"${field.name}?": ${fieldType}`);
  }

  return {
    stringified: `{\n  ${fields.join(",\n  ")}\n}`,
    enumDependencies,
    externalSchemaDependencies,
  };
}

function stringifyWhereUnique(model: DMMF.Model):
  | {
      stringified: string;
      enumDependencies: string[];
      externalSchemaDependencies: ExternalSchemaDependency[];
    }
  | undefined {
  const { annotations: modelAnnotations, hidden } = extractAnnotations(
    model.documentation,
  );

  if (hidden) {
    return;
  }

  const fields: string[] = [];
  const enumDependencies: string[] = [];
  const externalSchemaDependencies: ExternalSchemaDependency[] = [];

  // Helper function for generating unique aliases
  function generateUniqueAlias(
    path: string,
    exportName?: string,
    fieldName?: string,
  ): string {
    const baseName =
      exportName ||
      path
        .split("/")
        .pop()
        ?.replace(/\.(ts|js)$/, "") ||
      "Schema";
    const suffix = fieldName ? `_${fieldName}` : "";
    return `${baseName}${suffix}`;
  }

  for (const field of model.fields) {
    const { annotations: fieldAnnotations, hidden: fieldHidden } =
      extractAnnotations(field.documentation);

    if (fieldHidden) continue;
    if (field.kind === "object") continue;
    if (!(field.isId || field.isUnique)) continue;

    const schemaAnnotation = fieldAnnotations.find(isSchema);
    const typeOverwrite = fieldAnnotations.find(isTypeOverwrite);
    let fieldType: string;

    if (schemaAnnotation) {
      // HIGHEST PRIORITY: schema annotation
      if (schemaAnnotation.isExternal) {
        // External schema - generate alias and track dependency
        const alias = generateUniqueAlias(
          schemaAnnotation.importPath!,
          schemaAnnotation.exportName,
          field.name,
        );
        if (!externalSchemaDependencies.some((d) => d.localAlias === alias)) {
          const dependency: ExternalSchemaDependency = {
            importPath: schemaAnnotation.importPath!,
            localAlias: alias,
          };
          if (schemaAnnotation.exportName) {
            dependency.exportName = schemaAnnotation.exportName;
          }
          externalSchemaDependencies.push(dependency);
        }
        fieldType = alias;
      } else {
        // Inline schema - use directly
        // Object schemas ({ ... }) should not be quoted
        // Simple type strings should be quoted
        if (schemaAnnotation.value.trim().startsWith("{")) {
          fieldType = schemaAnnotation.value;
        } else {
          fieldType = `"${schemaAnnotation.value}"`;
        }
      }
    } else if (typeOverwrite) {
      fieldType = typeOverwrite.value;
    } else if (isPrimitivePrismaFieldType(field.type)) {
      fieldType = stringifyPrimitiveType(field.type, fieldAnnotations);
    } else if (field.kind === "enum") {
      const enumDef = processedEnums.find((e) => e.name === field.type);
      if (!enumDef) continue;

      // Track this enum as a dependency
      if (!enumDependencies.includes(field.type)) {
        enumDependencies.push(field.type);
      }

      // Reference the enum by name
      fieldType = field.type;
    } else {
      continue;
    }

    // All whereUnique fields are optional
    fields.push(`"${field.name}?": ${fieldType}`);
  }

  if (fields.length === 0) {
    return;
  }

  return {
    stringified: `{\n  ${fields.join(",\n  ")}\n}`,
    enumDependencies,
    externalSchemaDependencies,
  };
}
