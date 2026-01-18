import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getConfig } from "./config";
import type {
  ExternalSchemaDependency,
  ProcessedModel,
  RuntimeDependency,
} from "./model";

export async function format(input: string): Promise<string> {
  // For now, return input as-is. Could integrate prettier later
  return input;
}

function generateEnumImports(enumDependencies?: string[]): string {
  if (!enumDependencies || enumDependencies.length === 0) {
    return "";
  }
  return `${enumDependencies
    .map((enumName) => `import { ${enumName} } from "./${enumName}";`)
    .join("\n")}\n`;
}

function generateModelImports(modelDependencies?: string[]): string {
  if (!modelDependencies || modelDependencies.length === 0) {
    return "";
  }
  return `${modelDependencies
    .map(
      (modelName) => `import { ${modelName}Plain } from "./${modelName}Plain";`,
    )
    .join("\n")}\n`;
}

function generateExternalSchemaImports(
  externalSchemaDependencies?: ExternalSchemaDependency[],
): string {
  if (!externalSchemaDependencies || externalSchemaDependencies.length === 0) {
    return "";
  }

  return `${externalSchemaDependencies
    .map((dep) => {
      if (dep.exportName) {
        // Named export: import { ExportName as Alias } from "path"
        return `import { ${dep.exportName} as ${dep.localAlias} } from "${dep.importPath}";`;
      }
      // Default export: import Alias from "path"
      return `import ${dep.localAlias} from "${dep.importPath}";`;
    })
    .join("\n")}\n`;
}

/**
 * Maps runtime dependency names to their import paths
 */
const RUNTIME_DEPENDENCY_IMPORTS: Record<RuntimeDependency, string> = {
  DateTimeFilter: `import { DateTimeFilter } from "prisma-arktype/runtime/filters";\n`,
  StringFilter: `import { StringFilter } from "prisma-arktype/runtime/stringFilter";\n`,
  NumberFilter: `import { NumberFilter } from "prisma-arktype/runtime/numberFilter";\n`,
  IntFilter: `import { IntFilter } from "prisma-arktype/runtime/numberFilter";\n`,
  BooleanFilter: `import { BooleanFilter } from "prisma-arktype/runtime/booleanFilter";\n`,
  enumFilter: `import { enumFilter } from "prisma-arktype/runtime/enumFilter";\n`,
  BufferInstance: `import { BufferInstance } from "prisma-arktype/runtime/buffer";\n`,
  Uint8ArrayInstance: `import { Uint8ArrayInstance } from "prisma-arktype/runtime/uint8array";\n`,
  arrayFilter: `import { arrayFilter } from "prisma-arktype/runtime/arrayFilters";\n`,
  StringArrayFilter: `import { StringArrayFilter } from "prisma-arktype/runtime/arrayFilters";\n`,
  NumberArrayFilter: `import { NumberArrayFilter } from "prisma-arktype/runtime/arrayFilters";\n`,
  BigIntArrayFilter: `import { BigIntArrayFilter } from "prisma-arktype/runtime/arrayFilters";\n`,
};

/**
 * Generates import statements for runtime dependencies
 */
function generateRuntimeDependencyImports(
  runtimeDependencies?: RuntimeDependency[],
): string {
  if (!runtimeDependencies || runtimeDependencies.length === 0) {
    return "";
  }

  return runtimeDependencies
    .map((dep) => RUNTIME_DEPENDENCY_IMPORTS[dep])
    .join("");
}

export function mapAllModelsForWrite(
  processedEnums: ProcessedModel[],
  processedPlain: ProcessedModel[],
  processedRelations: ProcessedModel[],
  processedWhere: ProcessedModel[],
  processedWhereUnique: ProcessedModel[],
  processedCreate: ProcessedModel[],
  processedUpdate: ProcessedModel[],
  processedRelationsCreate: ProcessedModel[],
  processedRelationsUpdate: ProcessedModel[],
  processedSelect: ProcessedModel[],
  processedInclude: ProcessedModel[],
  processedOrderBy: ProcessedModel[],
): Map<string, string> {
  const config = getConfig();
  const modelMap = new Map<string, string>();

  const arktypeImport = `import { type } from "${config.arktypeImportDependencyName}";\n\n`;

  // Add enums
  for (const model of processedEnums) {
    const content = `${arktypeImport}export const ${model.name} = ${model.stringified};\n`;
    modelMap.set(model.name, content);
  }

  // Add plain models
  for (const model of processedPlain) {
    const enumImports = generateEnumImports(model.enumDependencies);
    const externalSchemaImports = generateExternalSchemaImports(
      model.externalSchemaDependencies,
    );
    const runtimeImports = generateRuntimeDependencyImports(
      model.runtimeDependencies,
    );
    const content = `${arktypeImport}${enumImports}${externalSchemaImports}${runtimeImports}export const ${model.name}Plain = type(${model.stringified});\n`;
    modelMap.set(`${model.name}Plain`, content);
  }

  // Add relations
  for (const model of processedRelations) {
    const modelImports = generateModelImports(model.modelDependencies);
    const content = `${arktypeImport}${modelImports}export const ${model.name}Relations = type(${model.stringified});\n`;
    modelMap.set(`${model.name}Relations`, content);
  }

  // Add combined models (Plain & Relations)
  for (const plain of processedPlain) {
    const hasRelations = processedRelations.some((r) => r.name === plain.name);
    if (hasRelations) {
      const content = `${arktypeImport}import { ${plain.name}Plain } from "./${plain.name}Plain";\nimport { ${plain.name}Relations } from "./${plain.name}Relations";\n\nexport const ${plain.name} = type(() => ${plain.name}Plain.and(${plain.name}Relations));\n`;
      modelMap.set(plain.name, content);
    } else {
      const content = `${arktypeImport}import { ${plain.name}Plain } from "./${plain.name}Plain";\n\nexport const ${plain.name} = ${plain.name}Plain;\n`;
      modelMap.set(plain.name, content);
    }
  }

  // Add where clauses
  for (const model of processedWhere) {
    const enumImports = generateEnumImports(model.enumDependencies);
    const externalSchemaImports = generateExternalSchemaImports(
      model.externalSchemaDependencies,
    );
    const runtimeImports = generateRuntimeDependencyImports(
      model.runtimeDependencies,
    );
    const content = `${arktypeImport}${enumImports}${externalSchemaImports}${runtimeImports}export const ${model.name}Where = type(${model.stringified});\n`;
    modelMap.set(`${model.name}Where`, content);
  }

  // Add whereUnique clauses
  for (const model of processedWhereUnique) {
    const enumImports = generateEnumImports(model.enumDependencies);
    const externalSchemaImports = generateExternalSchemaImports(
      model.externalSchemaDependencies,
    );
    const runtimeImports = generateRuntimeDependencyImports(
      model.runtimeDependencies,
    );
    const content = `${arktypeImport}${enumImports}${externalSchemaImports}${runtimeImports}export const ${model.name}WhereUnique = type(${model.stringified});\n`;
    modelMap.set(`${model.name}WhereUnique`, content);
  }

  // Add create inputs
  for (const model of processedCreate) {
    const enumImports = generateEnumImports(model.enumDependencies);
    const externalSchemaImports = generateExternalSchemaImports(
      model.externalSchemaDependencies,
    );
    const runtimeImports = generateRuntimeDependencyImports(
      model.runtimeDependencies,
    );
    const content = `${arktypeImport}${enumImports}${externalSchemaImports}${runtimeImports}export const ${model.name}Create = type(${model.stringified});\n`;
    modelMap.set(`${model.name}Create`, content);
  }

  // Add update inputs
  for (const model of processedUpdate) {
    const enumImports = generateEnumImports(model.enumDependencies);
    const externalSchemaImports = generateExternalSchemaImports(
      model.externalSchemaDependencies,
    );
    const runtimeImports = generateRuntimeDependencyImports(
      model.runtimeDependencies,
    );
    const content = `${arktypeImport}${enumImports}${externalSchemaImports}${runtimeImports}export const ${model.name}Update = type(${model.stringified});\n`;
    modelMap.set(`${model.name}Update`, content);
  }

  // Add relations create
  for (const model of processedRelationsCreate) {
    const content = `${arktypeImport}export const ${model.name}RelationsCreate = type(${model.stringified});\n`;
    modelMap.set(`${model.name}RelationsCreate`, content);
  }

  // Add relations update
  for (const model of processedRelationsUpdate) {
    const content = `${arktypeImport}export const ${model.name}RelationsUpdate = type(${model.stringified});\n`;
    modelMap.set(`${model.name}RelationsUpdate`, content);
  }

  // Add select
  for (const model of processedSelect) {
    const content = `${arktypeImport}export const ${model.name}Select = type(${model.stringified});\n`;
    modelMap.set(`${model.name}Select`, content);
  }

  // Add include
  for (const model of processedInclude) {
    const content = `${arktypeImport}export const ${model.name}Include = type(${model.stringified});\n`;
    modelMap.set(`${model.name}Include`, content);
  }

  // Add orderBy
  for (const model of processedOrderBy) {
    const content = `${arktypeImport}export const ${model.name}OrderBy = type(${model.stringified});\n`;
    modelMap.set(`${model.name}OrderBy`, content);
  }

  return modelMap;
}

export async function write(
  processedEnums: ProcessedModel[],
  processedPlain: ProcessedModel[],
  processedRelations: ProcessedModel[],
  processedWhere: ProcessedModel[],
  processedWhereUnique: ProcessedModel[],
  processedCreate: ProcessedModel[],
  processedUpdate: ProcessedModel[],
  processedRelationsCreate: ProcessedModel[],
  processedRelationsUpdate: ProcessedModel[],
  processedSelect: ProcessedModel[],
  processedInclude: ProcessedModel[],
  processedOrderBy: ProcessedModel[],
): Promise<void> {
  const config = getConfig();
  const modelMap = mapAllModelsForWrite(
    processedEnums,
    processedPlain,
    processedRelations,
    processedWhere,
    processedWhereUnique,
    processedCreate,
    processedUpdate,
    processedRelationsCreate,
    processedRelationsUpdate,
    processedSelect,
    processedInclude,
    processedOrderBy,
  );

  const writePromises: Promise<void>[] = [];

  for (const [name, content] of modelMap.entries()) {
    const filePath = join(config.output, `${name}.ts`);
    // biome-ignore lint/performance/noAwaitInLoops: <not a performance issue>
    writePromises.push(writeFile(filePath, await format(content)));
  }

  // TODO: determine perf hit of this
  // Create barrel file
  // const barrelExports = Array.from(modelMap.keys())
  //   .map((name) => `export * from "./${name}";`)
  //   .join("\n");
  // writePromises.push(
  //   writeFile(join(config.output, "index.ts"), await format(barrelExports)),
  // );

  await Promise.all(writePromises);
}
