/**
 * Generation Timing Benchmarks
 * Single-run timing measurements for full generation pipeline
 *
 * NOTE: Generators use global frozen arrays, so we can only measure once per schema.
 * This provides baseline timing data for regression detection.
 */

import { bench, describe } from "vitest";
import { processCreate } from "../../src/generators/create";
import { processEnums } from "../../src/generators/enum";
import { processInclude } from "../../src/generators/include";
import { processOrderBy } from "../../src/generators/orderBy";
import { processPlain } from "../../src/generators/plain";
import {
  processRelations,
  processRelationsCreate,
  processRelationsUpdate,
} from "../../src/generators/relations";
import { processSelect } from "../../src/generators/select";
import { processUpdate } from "../../src/generators/update";
import { processWhere } from "../../src/generators/where";
import { loadSchema } from "../utils/schema-loader";

// Load schemas once
const smallSchema = await loadSchema("small");
const mediumSchema = await loadSchema("medium");

/**
 * Run full generation pipeline (all 11 processors)
 */
// biome-ignore lint/suspicious/noExplicitAny: <used for perf only>
function runFullGeneration(dmmf: any) {
  processEnums(dmmf.datamodel.enums);
  processPlain(dmmf.datamodel.models);
  processWhere(dmmf.datamodel.models);
  processCreate(dmmf.datamodel.models);
  processUpdate(dmmf.datamodel.models);
  processSelect(dmmf.datamodel.models);
  processInclude(dmmf.datamodel.models);
  processOrderBy(dmmf.datamodel.models);
  processRelations(dmmf.datamodel.models);
  processRelationsCreate(dmmf.datamodel.models);
  processRelationsUpdate(dmmf.datamodel.models);
}

describe("Generation Timing - Single Measurement", () => {
  bench(
    "Small schema (5 models, ~30 fields) - Full Pipeline",
    () => {
      const start = performance.now();
      runFullGeneration(smallSchema.dmmf);
      const duration = performance.now() - start;

      // Calculate throughput
      const modelsPerSec = (smallSchema.info.stats.models / duration) * 1000;
      const fieldsPerSec = (smallSchema.info.stats.fields / duration) * 1000;

      console.log(`\n  Duration: ${duration.toFixed(2)}ms`);
      console.log(
        `  Throughput: ${modelsPerSec.toFixed(0)} models/sec, ${fieldsPerSec.toFixed(0)} fields/sec`,
      );
    },
    {
      iterations: 1, // Single run due to frozen arrays
      warmupIterations: 0,
    },
  );
});

describe("Medium Schema Timing", () => {
  bench(
    "Medium schema (25 models, ~200 fields) - Full Pipeline",
    () => {
      const start = performance.now();
      runFullGeneration(mediumSchema.dmmf);
      const duration = performance.now() - start;

      const modelsPerSec = (mediumSchema.info.stats.models / duration) * 1000;
      const fieldsPerSec = (mediumSchema.info.stats.fields / duration) * 1000;

      console.log(`\n  Duration: ${duration.toFixed(2)}ms`);
      console.log(
        `  Throughput: ${modelsPerSec.toFixed(0)} models/sec, ${fieldsPerSec.toFixed(0)} fields/sec`,
      );
    },
    {
      iterations: 1,
      warmupIterations: 0,
    },
  );
});
