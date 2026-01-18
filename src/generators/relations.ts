import type { DMMF } from "@prisma/generator-helper";
import { extractAnnotations } from "../annotations";
import type { ProcessedModel } from "../model";

export const processedRelations: ProcessedModel[] = [];
export const processedRelationsCreate: ProcessedModel[] = [];
export const processedRelationsUpdate: ProcessedModel[] = [];

export function processRelations(
  models: DMMF.Model[] | Readonly<DMMF.Model[]>,
): void {
  for (const model of models) {
    const result = stringifyRelations(model);
    if (result) {
      processedRelations.push({
        name: model.name,
        stringified: result.stringified,
        modelDependencies: result.modelDependencies,
      });
    }
  }
  Object.freeze(processedRelations);
}

function stringifyRelations(
  model: DMMF.Model,
): { stringified: string; modelDependencies: string[] } | undefined {
  const { hidden } = extractAnnotations(model.documentation);

  if (hidden) {
    return;
  }

  const fields: string[] = [];
  const modelDependencies: string[] = [];

  for (const field of model.fields) {
    const { hidden: fieldHidden } = extractAnnotations(field.documentation);

    if (fieldHidden) continue;
    if (field.kind !== "object") continue; // Only process relations

    // Reference the Plain type of the related model
    const relatedModelPlain = `${field.type}Plain`;

    // Track this model as a dependency
    if (!modelDependencies.includes(field.type)) {
      modelDependencies.push(field.type);
    }

    let fieldType: string;

    // Apply wrappers - use type().array() for proper array syntax
    if (field.isList) {
      fieldType = `${relatedModelPlain}.array()`;
    } else if (!field.isRequired) {
      fieldType = `${relatedModelPlain}.or("null")`;
    } else {
      fieldType = relatedModelPlain;
    }

    fields.push(`"${field.name}": ${fieldType}`);
  }

  if (fields.length === 0) {
    return;
  }

  return {
    stringified: `{\n  ${fields.join(",\n  ")}\n}`,
    modelDependencies,
  };
}

export function processRelationsCreate(
  models: DMMF.Model[] | Readonly<DMMF.Model[]>,
): void {
  for (const model of models) {
    const stringified = stringifyRelationsInputCreate(model, models);
    if (stringified) {
      processedRelationsCreate.push({
        name: model.name,
        stringified,
      });
    }
  }
  Object.freeze(processedRelationsCreate);
}

function stringifyRelationsInputCreate(
  model: DMMF.Model,
  allModels: DMMF.Model[] | Readonly<DMMF.Model[]>,
): string | undefined {
  const { hidden } = extractAnnotations(model.documentation);

  if (hidden) {
    return;
  }

  const fields: string[] = [];

  for (const field of model.fields) {
    const {
      hidden: fieldHidden,
      hiddenInput,
      hiddenInputCreate,
    } = extractAnnotations(field.documentation);

    if (fieldHidden || hiddenInput || hiddenInputCreate) continue;
    if (field.kind !== "object") continue;

    // Find the related model to get its ID type
    const relatedModel = allModels.find((m) => m.name === field.type);
    if (!relatedModel) continue;

    const idField = relatedModel.fields.find((f) => f.isId);
    let idType = '"string"';
    if (idField) {
      if (idField.type === "Int" || idField.type === "BigInt") {
        idType = '"integer"';
      }
    }

    const connectType = `{ "connect": { "id": ${idType} } }`;
    fields.push(`"${field.name}?": ${connectType}`);
  }

  if (fields.length === 0) {
    return;
  }

  return `{\n  ${fields.join(",\n  ")}\n}`;
}

export function processRelationsUpdate(
  models: DMMF.Model[] | Readonly<DMMF.Model[]>,
): void {
  for (const model of models) {
    const stringified = stringifyRelationsInputUpdate(model, models);
    if (stringified) {
      processedRelationsUpdate.push({
        name: model.name,
        stringified,
      });
    }
  }
  Object.freeze(processedRelationsUpdate);
}

function stringifyRelationsInputUpdate(
  model: DMMF.Model,
  allModels: DMMF.Model[] | Readonly<DMMF.Model[]>,
): string | undefined {
  const { hidden } = extractAnnotations(model.documentation);

  if (hidden) {
    return;
  }

  const fields: string[] = [];

  for (const field of model.fields) {
    const {
      hidden: fieldHidden,
      hiddenInput,
      hiddenInputUpdate,
    } = extractAnnotations(field.documentation);

    if (fieldHidden || hiddenInput || hiddenInputUpdate) continue;
    if (field.kind !== "object") continue;

    const relatedModel = allModels.find((m) => m.name === field.type);
    if (!relatedModel) continue;

    const idField = relatedModel.fields.find((f) => f.isId);
    let idType = '"string"';
    if (idField) {
      if (idField.type === "Int" || idField.type === "BigInt") {
        idType = '"integer"';
      }
    }

    let fieldType: string;
    if (field.isList) {
      // For list relations, allow connect and disconnect arrays
      // Arrays of objects need to use type({}).array() syntax
      const connectType = `type({ "id": ${idType} }).array()`;
      const disconnectType = `type({ "id": ${idType} }).array()`;
      fieldType = `{ "connect?": ${connectType}, "disconnect?": ${disconnectType} }`;
    } else {
      // For single relations
      if (field.isRequired) {
        fieldType = `{ "connect": { "id": ${idType} } }`;
      } else {
        fieldType = `{ "connect?": { "id": ${idType} }, "disconnect?": "boolean" }`;
      }
    }

    fields.push(`"${field.name}?": ${fieldType}`);
  }

  if (fields.length === 0) {
    return;
  }

  return `{\n  ${fields.join(",\n  ")}\n}`;
}
