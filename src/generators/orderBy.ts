import type { DMMF } from "@prisma/generator-helper";
import { extractAnnotations } from "../annotations";
import type { ProcessedModel } from "../model";

export const processedOrderBy: ProcessedModel[] = [];

export function processOrderBy(
  models: DMMF.Model[] | Readonly<DMMF.Model[]>,
): void {
  for (const model of models) {
    const stringified = stringifyOrderBy(model);
    if (stringified) {
      processedOrderBy.push({
        name: model.name,
        stringified,
      });
    }
  }
  Object.freeze(processedOrderBy);
}

function stringifyOrderBy(model: DMMF.Model): string | undefined {
  const { annotations: modelAnnotations, hidden } = extractAnnotations(
    model.documentation,
  );

  if (hidden) {
    return;
  }

  const fields: string[] = [];
  const sortOrder = "\"'asc' | 'desc'\"";

  for (const field of model.fields) {
    const { hidden: fieldHidden } = extractAnnotations(field.documentation);

    if (fieldHidden) continue;
    if (field.kind === "object") continue; // Skip relations

    fields.push(`"${field.name}?": ${sortOrder}`);
  }

  return `{\n  ${fields.join(",\n  ")}\n}`;
}
