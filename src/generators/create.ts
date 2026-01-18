import type { DMMF } from "@prisma/generator-helper";
import { extractAnnotations } from "../annotations";
import { stringifyPlainInputCreate } from "./plain";
import type { ProcessedModel } from "../model";

export const processedCreate: ProcessedModel[] = [];

export function processCreate(
  models: DMMF.Model[] | Readonly<DMMF.Model[]>,
): void {
  for (const model of models) {
    const { hidden } = extractAnnotations(model.documentation);
    if (hidden) continue;

    const result = stringifyPlainInputCreate(model);
    if (result) {
      const processedModel: ProcessedModel = {
        name: model.name,
        stringified: result.stringified,
        enumDependencies: result.enumDependencies,
        externalSchemaDependencies: result.externalSchemaDependencies,
      };
      if (result.needsBufferInstance) {
        processedModel.needsBufferInstance = true;
      }
      if (result.needsUint8ArrayInstance) {
        processedModel.needsUint8ArrayInstance = true;
      }
      processedCreate.push(processedModel);
    }
  }
  Object.freeze(processedCreate);
}
