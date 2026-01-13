import type { DMMF } from "@prisma/generator-helper";
import { extractAnnotations, isTypeOverwrite } from "../annotations";
import {
  isPrimitivePrismaFieldType,
  stringifyPrimitiveType,
} from "../primitiveField";
import { wrapPrimitiveWithArray } from "../wrappers";
import { processedEnums } from "./enum";
import type { ProcessedModel } from "../model";

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
      });
    }

    const uniqueResult = stringifyWhereUnique(model);
    if (uniqueResult) {
      processedWhereUnique.push({
        name: model.name,
        stringified: uniqueResult.stringified,
        enumDependencies: uniqueResult.enumDependencies,
      });
    }
  }
  Object.freeze(processedWhere);
  Object.freeze(processedWhereUnique);
}

const enumMatch = /type\("(.+)"\)/;

function stringifyWhere(
  model: DMMF.Model,
): { stringified: string; enumDependencies: string[] } | undefined {
  const { annotations: modelAnnotations, hidden } = extractAnnotations(
    model.documentation,
  );

  if (hidden) {
    return;
  }

  const fields: string[] = [];
  const enumDependencies: string[] = [];

  for (const field of model.fields) {
    const { annotations: fieldAnnotations, hidden: fieldHidden } =
      extractAnnotations(field.documentation);

    if (fieldHidden) continue;
    if (field.kind === "object") continue; // Skip relations

    const typeOverwrite = fieldAnnotations.find(isTypeOverwrite);
    let fieldType: string;

    if (typeOverwrite) {
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

    const isEnumType = field.kind === "enum" && !typeOverwrite;

    if (field.isList) {
      if (isEnumType) {
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
  };
}

function stringifyWhereUnique(
  model: DMMF.Model,
): { stringified: string; enumDependencies: string[] } | undefined {
  const { annotations: modelAnnotations, hidden } = extractAnnotations(
    model.documentation,
  );

  if (hidden) {
    return;
  }

  const fields: string[] = [];
  const enumDependencies: string[] = [];

  for (const field of model.fields) {
    const { annotations: fieldAnnotations, hidden: fieldHidden } =
      extractAnnotations(field.documentation);

    if (fieldHidden) continue;
    if (field.kind === "object") continue;
    if (!(field.isId || field.isUnique)) continue;

    const typeOverwrite = fieldAnnotations.find(isTypeOverwrite);
    let fieldType: string;

    if (typeOverwrite) {
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
  };
}
