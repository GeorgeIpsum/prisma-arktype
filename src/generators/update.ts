import type { DMMF } from "@prisma/generator-helper";
import { extractAnnotations } from "../annotations";
import { stringifyPlainInputUpdate } from "./plain";
import type { ProcessedModel } from "../model";

export const processedUpdate: ProcessedModel[] = [];

export function processUpdate(
  models: DMMF.Model[] | Readonly<DMMF.Model[]>,
): void {
  for (const model of models) {
    const { hidden } = extractAnnotations(model.documentation);
    if (hidden) continue;

    const result = stringifyPlainInputUpdate(model);
    if (result) {
      processedUpdate.push({
        name: model.name,
        stringified: result.stringified,
        enumDependencies: result.enumDependencies,
        externalSchemaDependencies: result.externalSchemaDependencies,
        runtimeDependencies: result.runtimeDependencies,
      });
    }
  }
  Object.freeze(processedUpdate);
}
