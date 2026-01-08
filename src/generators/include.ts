import type { DMMF } from "@prisma/generator-helper";
import { extractAnnotations } from "../annotations";
import type { ProcessedModel } from "../model";

export const processedInclude: ProcessedModel[] = [];

export function processInclude(
  models: DMMF.Model[] | Readonly<DMMF.Model[]>,
): void {
  for (const model of models) {
    const stringified = stringifyInclude(model);
    if (stringified) {
      processedInclude.push({
        name: model.name,
        stringified,
      });
    }
  }
  Object.freeze(processedInclude);
}

function stringifyInclude(model: DMMF.Model): string | undefined {
  const { annotations: modelAnnotations, hidden } = extractAnnotations(
    model.documentation,
  );

  if (hidden) {
    return;
  }

  const fields: string[] = [];

  for (const field of model.fields) {
    const { hidden: fieldHidden } = extractAnnotations(field.documentation);

    if (fieldHidden) continue;
    if (field.kind !== "object") continue; // Only process relations

    fields.push(`"${field.name}?": "boolean"`);
  }

  // Add _count field
  fields.push(`"_count?": "boolean"`);

  if (fields.length <= 1) {
    // Only _count field, no relations
    return;
  }

  return `{\n  ${fields.join(",\n  ")}\n}`;
}
