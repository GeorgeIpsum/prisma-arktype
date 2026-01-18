import type { DMMF } from "@prisma/generator-helper";
import { extractAnnotations, isSchema, isTypeOverwrite } from "../annotations";
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

export const processedWhere: ProcessedModel[] = [];
export const processedWhereUnique: ProcessedModel[] = [];

const extRegex = /\.(ts|js)$/;

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
        runtimeDependencies: result.runtimeDependencies,
      });
    }

    const uniqueResult = stringifyWhereUnique(model);
    if (uniqueResult) {
      processedWhereUnique.push({
        name: model.name,
        stringified: uniqueResult.stringified,
        enumDependencies: uniqueResult.enumDependencies,
        externalSchemaDependencies: uniqueResult.externalSchemaDependencies,
        runtimeDependencies: uniqueResult.runtimeDependencies,
      });
    }
  }
  Object.freeze(processedWhere);
  Object.freeze(processedWhereUnique);
}

const _enumMatch = /type\("(.+)"\)/;

function stringifyWhere(model: DMMF.Model):
  | {
      stringified: string;
      enumDependencies: string[];
      externalSchemaDependencies: ExternalSchemaDependency[];
      runtimeDependencies: RuntimeDependency[];
    }
  | undefined {
  const { hidden } = extractAnnotations(model.documentation);

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
      exportName || path.split("/").pop()?.replace(extRegex, "") || "Schema";
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
          schemaAnnotation.importPath as string,
          schemaAnnotation.exportName,
          field.name,
        );
        if (!externalSchemaDependencies.some((d) => d.localAlias === alias)) {
          const dependency: ExternalSchemaDependency = {
            importPath: schemaAnnotation.importPath as string,
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
    const isDateTimeField =
      field.type === "DateTime" && !typeOverwrite && !schemaAnnotation;
    const isStringField =
      field.type === "String" && !typeOverwrite && !schemaAnnotation;
    const isIntField =
      (field.type === "Int" || field.type === "BigInt") &&
      !typeOverwrite &&
      !schemaAnnotation;
    const isFloatField =
      (field.type === "Float" || field.type === "Decimal") &&
      !typeOverwrite &&
      !schemaAnnotation;
    const isBooleanField =
      field.type === "Boolean" && !typeOverwrite && !schemaAnnotation;
    const isBytesField =
      field.type === "Bytes" && !typeOverwrite && !schemaAnnotation;

    // Track runtime dependencies for Bytes fields
    if (isBytesField) {
      const runtimeDep = fieldType as RuntimeDependency;
      if (!runtimeDependencies.includes(runtimeDep)) {
        runtimeDependencies.push(runtimeDep);
      }
    }

    // Handle array fields in Where clauses with array filters
    if (field.isList) {
      // For enum arrays, use arrayFilter generic
      if (isEnumType) {
        fieldType = `arrayFilter(${fieldType})`;
        if (!runtimeDependencies.includes("arrayFilter")) {
          runtimeDependencies.push("arrayFilter");
        }
      } else if (
        field.type === "String" &&
        !typeOverwrite &&
        !schemaAnnotation
      ) {
        // String array - use StringArrayFilter
        fieldType = "StringArrayFilter";
        if (!runtimeDependencies.includes("StringArrayFilter")) {
          runtimeDependencies.push("StringArrayFilter");
        }
      } else if (
        (field.type === "Int" ||
          field.type === "Float" ||
          field.type === "Decimal") &&
        !typeOverwrite &&
        !schemaAnnotation
      ) {
        // Number array - use NumberArrayFilter
        fieldType = "NumberArrayFilter";
        if (!runtimeDependencies.includes("NumberArrayFilter")) {
          runtimeDependencies.push("NumberArrayFilter");
        }
      } else if (
        field.type === "BigInt" &&
        !typeOverwrite &&
        !schemaAnnotation
      ) {
        // BigInt array - use BigIntArrayFilter
        fieldType = "BigIntArrayFilter";
        if (!runtimeDependencies.includes("BigIntArrayFilter")) {
          runtimeDependencies.push("BigIntArrayFilter");
        }
      } else if (isExternalSchema || isBytesField) {
        // External schemas and Bytes fields use array() wrapper
        fieldType = `${fieldType}.array()`;
      } else {
        // Fallback for other primitive arrays
        const inner = fieldType.slice(1, -1);
        fieldType = `"${wrapPrimitiveWithArray(inner)}"`;
      }
    }

    // DateTime fields can accept either Date or DateTimeFilter
    if (isDateTimeField && !field.isList) {
      // Use type() constructor to create a union with DateTimeFilter
      fieldType = `type("Date").or(DateTimeFilter)`;
      if (!runtimeDependencies.includes("DateTimeFilter")) {
        runtimeDependencies.push("DateTimeFilter");
      }
    }

    // String fields can accept either string or StringFilter
    if (isStringField && !field.isList) {
      // Use type() constructor to create a union with StringFilter
      fieldType = `type("string").or(StringFilter)`;
      if (!runtimeDependencies.includes("StringFilter")) {
        runtimeDependencies.push("StringFilter");
      }
    }

    // Int/BigInt fields can accept either number.integer or IntFilter
    if (isIntField && !field.isList) {
      // Use type() constructor to create a union with IntFilter
      fieldType = `type("number.integer").or(IntFilter)`;
      if (!runtimeDependencies.includes("IntFilter")) {
        runtimeDependencies.push("IntFilter");
      }
    }

    // Float/Decimal fields can accept either number or NumberFilter
    if (isFloatField && !field.isList) {
      // Use type() constructor to create a union with NumberFilter
      fieldType = `type("number").or(NumberFilter)`;
      if (!runtimeDependencies.includes("NumberFilter")) {
        runtimeDependencies.push("NumberFilter");
      }
    }

    // Enum fields can accept either the enum value or enumFilter
    if (isEnumType && !field.isList) {
      // Use type() constructor to create a union with enumFilter
      fieldType = `type(${fieldType}).or(enumFilter(${fieldType}))`;
      if (!runtimeDependencies.includes("enumFilter")) {
        runtimeDependencies.push("enumFilter");
      }
    }

    // Boolean fields can accept either boolean or BooleanFilter
    if (isBooleanField && !field.isList) {
      // Use type() constructor to create a union with BooleanFilter
      fieldType = `type("boolean").or(BooleanFilter)`;
      if (!runtimeDependencies.includes("BooleanFilter")) {
        runtimeDependencies.push("BooleanFilter");
      }
    }

    // All where fields are optional
    fields.push(`"${field.name}?": ${fieldType}`);
  }

  return {
    stringified: `{\n  ${fields.join(",\n  ")}\n}`,
    enumDependencies,
    externalSchemaDependencies,
    runtimeDependencies,
  };
}

function stringifyWhereUnique(model: DMMF.Model):
  | {
      stringified: string;
      enumDependencies: string[];
      externalSchemaDependencies: ExternalSchemaDependency[];
      runtimeDependencies: RuntimeDependency[];
    }
  | undefined {
  const { hidden } = extractAnnotations(model.documentation);

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
      exportName || path.split("/").pop()?.replace(extRegex, "") || "Schema";
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
          schemaAnnotation.importPath as string,
          schemaAnnotation.exportName,
          field.name,
        );
        if (!externalSchemaDependencies.some((d) => d.localAlias === alias)) {
          const dependency: ExternalSchemaDependency = {
            importPath: schemaAnnotation.importPath as string,
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

    const isDateTimeField =
      field.type === "DateTime" && !typeOverwrite && !schemaAnnotation;
    const isBytesField =
      field.type === "Bytes" && !typeOverwrite && !schemaAnnotation;

    // Track runtime dependencies for Bytes fields
    if (isBytesField) {
      const runtimeDep = fieldType as RuntimeDependency;
      if (!runtimeDependencies.includes(runtimeDep)) {
        runtimeDependencies.push(runtimeDep);
      }
    }

    // DateTime fields can accept either Date or DateTimeFilter
    if (isDateTimeField) {
      // Use type() constructor to create a union with DateTimeFilter
      fieldType = `type("Date").or(DateTimeFilter)`;
      if (!runtimeDependencies.includes("DateTimeFilter")) {
        runtimeDependencies.push("DateTimeFilter");
      }
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
    runtimeDependencies,
  };
}
