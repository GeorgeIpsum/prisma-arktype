import type { DMMF } from "@prisma/generator-helper";
import { extractAnnotations, generateArktypeOptions } from "../annotations";
import type { ProcessedModel } from "../model";

export const processedSelect: ProcessedModel[] = [];

export function processSelect(
  models: DMMF.Model[] | Readonly<DMMF.Model[]>,
): void {
  for (const model of models) {
    const stringified = stringifySelect(model);
    if (stringified) {
      processedSelect.push({
        name: model.name,
        stringified,
      });
    }
  }
  Object.freeze(processedSelect);
}

function stringifySelect(model: DMMF.Model): string | undefined {
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

    fields.push(`"${field.name}?": "boolean"`);
  }

  // Add _count field
  fields.push(`"_count?": "boolean"`);

  const options = generateArktypeOptions(modelAnnotations);
  return `{\n  ${fields.join(",\n  ")}\n}${options}`;
}
