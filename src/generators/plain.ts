import type { DMMF } from "@prisma/generator-helper";
import { extractAnnotations, isSchema, isTypeOverwrite } from "../annotations";
import { getConfig } from "../config";
import {
  isPrimitivePrismaFieldType,
  stringifyPrimitiveType,
} from "../primitiveField";
import { wrapPrimitiveWithArray } from "../wrappers";
import { processedEnums } from "./enum";
import type {
  ExternalSchemaDependency,
  ProcessedModel,
  RuntimeDependency,
} from "../model";

export const processedPlain: ProcessedModel[] = [];

export function processPlain(
  models: DMMF.Model[] | Readonly<DMMF.Model[]>,
): void {
  for (const model of models) {
    const result = stringifyPlain(model);
    if (result) {
      processedPlain.push({
        name: model.name,
        stringified: result.stringified,
        enumDependencies: result.enumDependencies,
        externalSchemaDependencies: result.externalSchemaDependencies,
        runtimeDependencies: result.runtimeDependencies,
      });
    }
  }
  Object.freeze(processedPlain);
}

const _enumMatch = /type\("(.+)"\)/;

function stringifyPlain(
  model: DMMF.Model,
  isInputCreate = false,
  isInputUpdate = false,
):
  | {
      stringified: string;
      enumDependencies: string[];
      externalSchemaDependencies: ExternalSchemaDependency[];
      runtimeDependencies: RuntimeDependency[];
    }
  | undefined {
  const config = getConfig();
  const { annotations: modelAnnotations, hidden } = extractAnnotations(
    model.documentation,
  );

  if (hidden) {
    return;
  }

  const fields: string[] = [];
  const enumDependencies: string[] = [];
  const externalSchemaDependencies: ExternalSchemaDependency[] = [];
  const runtimeDependencies: RuntimeDependency[] = [];

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
    const {
      annotations: fieldAnnotations,
      hidden: fieldHidden,
      hiddenInput,
      hiddenInputCreate,
      hiddenInputUpdate,
    } = extractAnnotations(field.documentation);

    // Skip hidden fields
    if (fieldHidden) continue;
    if (isInputCreate && (hiddenInput || hiddenInputCreate)) continue;
    if (isInputUpdate && (hiddenInput || hiddenInputUpdate)) continue;

    // Skip relations for plain model
    if (field.kind === "object") continue;

    // Skip fields based on config for input models
    if (isInputCreate || isInputUpdate) {
      if (config.ignoredKeysOnInputModels.includes(field.name)) continue;
      // Skip foreign keys ending with "Id" for input models
      if (field.name.endsWith("Id") && field.relationName) continue;
    }

    // Check for schema and type overwrite annotations
    const schemaAnnotation = fieldAnnotations.find(isSchema);
    const typeOverwrite = fieldAnnotations.find(isTypeOverwrite);
    let fieldType: string;
    let fieldName = field.name;

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
      // Reference the enum type directly instead of inlining
      const enumDef = processedEnums.find((e) => e.name === field.type);
      if (!enumDef) continue;

      // Track this enum as a dependency
      if (!enumDependencies.includes(field.type)) {
        enumDependencies.push(field.type);
      }

      // Reference the enum by name (not as a string)
      fieldType = field.type;
    } else {
      continue;
    }

    // Apply wrappers
    const isEnumType =
      field.kind === "enum" && !typeOverwrite && !schemaAnnotation;
    const isExternalSchema = schemaAnnotation?.isExternal === true;
    const isBytesField =
      field.type === "Bytes" && !typeOverwrite && !schemaAnnotation;

    // Track runtime dependencies for Bytes fields
    if (isBytesField) {
      const runtimeDep = fieldType as RuntimeDependency;
      if (!runtimeDependencies.includes(runtimeDep)) {
        runtimeDependencies.push(runtimeDep);
      }
    }

    if (field.isList) {
      if (isExternalSchema || isEnumType || isBytesField) {
        fieldType = `${fieldType}.array()`;
      } else {
        fieldType = `"${wrapPrimitiveWithArray(fieldType.slice(1, -1))}"`;
      }
    }
    if (!field.isRequired) {
      if (isExternalSchema || isEnumType || isBytesField) {
        fieldType = `${fieldType}.or("null")`;
      } else {
        // Remove quotes, add null, re-add quotes
        const inner = fieldType.slice(1, -1);
        fieldType = `"${inner} | null"`;
      }
      // In ArkType, optional fields (can be missing) need ? on the key
      fieldName += "?";
    }
    // Fields with defaults are also optional in create/update
    if (field.hasDefaultValue || isInputUpdate) {
      if (!fieldName.endsWith("?")) {
        fieldName += "?";
      }
    }

    fields.push(`"${fieldName}": ${fieldType}`);
  }

  return {
    stringified: `{\n  ${fields.join(",\n  ")}\n}`,
    enumDependencies,
    externalSchemaDependencies,
    runtimeDependencies,
  };
}

export function stringifyPlainInputCreate(model: DMMF.Model):
  | {
      stringified: string;
      enumDependencies: string[];
      externalSchemaDependencies: ExternalSchemaDependency[];
      runtimeDependencies: RuntimeDependency[];
    }
  | undefined {
  return stringifyPlain(model, true, false);
}

export function stringifyPlainInputUpdate(model: DMMF.Model):
  | {
      stringified: string;
      enumDependencies: string[];
      externalSchemaDependencies: ExternalSchemaDependency[];
      runtimeDependencies: RuntimeDependency[];
    }
  | undefined {
  return stringifyPlain(model, false, true);
}
