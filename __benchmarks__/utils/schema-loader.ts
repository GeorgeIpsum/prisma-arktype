/**
 * Schema loader utility for benchmark tests
 * Loads and prepares Prisma schemas for benchmarking
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { DMMF } from "@prisma/generator-helper";
import { getDMMF } from "@prisma/generator-helper";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface SchemaInfo {
  name: string;
  path: string;
  content: string;
  stats: {
    models: number;
    enums: number;
    fields: number;
  };
}

/**
 * Load a Prisma schema file by name
 */
export async function loadSchema(schemaName: string): Promise<{
  dmmf: DMMF.Document;
  info: SchemaInfo;
}> {
  const schemaPath = join(__dirname, "../fixtures", `${schemaName}.prisma`);
  const content = readFileSync(schemaPath, "utf-8");

  // Generate DMMF from schema
  const dmmf = await getDMMF({
    datamodel: content,
  });

  // Calculate stats
  const stats = {
    models: dmmf.datamodel.models.length,
    enums: dmmf.datamodel.enums.length,
    fields: dmmf.datamodel.models.reduce(
      (acc, model) => acc + model.fields.length,
      0,
    ),
  };

  return {
    dmmf,
    info: {
      name: schemaName,
      path: schemaPath,
      content,
      stats,
    },
  };
}

/**
 * Load a realistic schema from the realistic/ subdirectory
 */
export async function loadRealisticSchema(schemaName: string): Promise<{
  dmmf: DMMF.Document;
  info: SchemaInfo;
}> {
  const schemaPath = join(
    __dirname,
    "../fixtures/realistic",
    `${schemaName}.prisma`,
  );
  const content = readFileSync(schemaPath, "utf-8");

  const dmmf = await getDMMF({
    datamodel: content,
  });

  const stats = {
    models: dmmf.datamodel.models.length,
    enums: dmmf.datamodel.enums.length,
    fields: dmmf.datamodel.models.reduce(
      (acc, model) => acc + model.fields.length,
      0,
    ),
  };

  return {
    dmmf,
    info: {
      name: `realistic/${schemaName}`,
      path: schemaPath,
      content,
      stats,
    },
  };
}

/**
 * Get all available test schemas
 */
export function getAvailableSchemas(): string[] {
  return ["small", "medium", "large", "extreme"];
}

/**
 * Get all available realistic schemas
 */
export function getRealisticSchemas(): string[] {
  return ["ecommerce", "saas", "social"];
}

/**
 * Preload all schemas for faster access during benchmarks
 */
export async function preloadAllSchemas(): Promise<
  Map<string, { dmmf: DMMF.Document; info: SchemaInfo }>
> {
  const cache = new Map<string, { dmmf: DMMF.Document; info: SchemaInfo }>();

  // Load standard schemas
  for (const name of getAvailableSchemas()) {
    const result = await loadSchema(name);
    cache.set(name, result);
  }

  // Load realistic schemas
  for (const name of getRealisticSchemas()) {
    const result = await loadRealisticSchema(name);
    cache.set(`realistic/${name}`, result);
  }

  return cache;
}

/**
 * Display schema statistics
 */
export function displaySchemaStats(info: SchemaInfo): void {
  console.log(`\nSchema: ${info.name}`);
  console.log(`  Models: ${info.stats.models}`);
  console.log(`  Enums: ${info.stats.enums}`);
  console.log(`  Fields: ${info.stats.fields}`);
  console.log(
    `  Avg Fields/Model: ${(info.stats.fields / info.stats.models).toFixed(1)}`,
  );
}
