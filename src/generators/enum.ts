import type { DMMF } from "@prisma/generator-helper";
import { extractAnnotations } from "../annotations";
import { makeUnion } from "../wrappers";
import type { ProcessedModel } from "../model";

export const processedEnums: ProcessedModel[] = [];

export function processEnums(
  enums: DMMF.DatamodelEnum[] | Readonly<DMMF.DatamodelEnum[]>,
): void {
  for (const enumData of enums) {
    const stringified = stringifyEnum(enumData);
    if (stringified) {
      processedEnums.push({
        name: enumData.name,
        stringified,
      });
    }
  }
  Object.freeze(processedEnums);
}

function stringifyEnum(enumData: DMMF.DatamodelEnum): string | undefined {
  const { annotations, hidden } = extractAnnotations(enumData.documentation);

  if (hidden) {
    return;
  }

  // In ArkType, string literals in unions need single quotes
  const values = enumData.values.map((v) => `'${v.name}'`);

  return `type("${makeUnion(values)}")`;
}
