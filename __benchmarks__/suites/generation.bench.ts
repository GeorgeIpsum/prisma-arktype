/**
 * End-to-End Generation Benchmarks
 * Measures complete generation pipeline performance across different schema sizes
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
import { loadRealisticSchema, loadSchema } from "../utils/schema-loader";

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

describe("End-to-End Generation - Standard Schemas", () => {
  bench(
    "Small schema (5 models, ~30 fields)",
    async () => {
      const { dmmf } = await loadSchema("small");
      runFullGeneration(dmmf);
    },
    {
      iterations: 100,
      warmupIterations: 10,
    },
  );

  bench(
    "Medium schema (25 models, ~200 fields)",
    async () => {
      const { dmmf } = await loadSchema("medium");
      runFullGeneration(dmmf);
    },
    {
      iterations: 50,
      warmupIterations: 5,
    },
  );

  bench(
    "Large schema (100 models, ~800 fields)",
    async () => {
      const { dmmf } = await loadSchema("large");
      runFullGeneration(dmmf);
    },
    {
      iterations: 10,
      warmupIterations: 2,
    },
  );

  bench(
    "Extreme schema (500 models, ~4000 fields)",
    async () => {
      const { dmmf } = await loadSchema("extreme");
      runFullGeneration(dmmf);
    },
    {
      iterations: 5,
      warmupIterations: 1,
    },
  );
});

describe("End-to-End Generation - Realistic Schemas", () => {
  bench(
    "E-commerce (30 models)",
    async () => {
      const { dmmf } = await loadRealisticSchema("ecommerce");
      runFullGeneration(dmmf);
    },
    {
      iterations: 50,
      warmupIterations: 5,
    },
  );

  bench(
    "SaaS Platform (50 models)",
    async () => {
      const { dmmf } = await loadRealisticSchema("saas");
      runFullGeneration(dmmf);
    },
    {
      iterations: 20,
      warmupIterations: 3,
    },
  );

  bench(
    "Social Network (40 models)",
    async () => {
      const { dmmf } = await loadRealisticSchema("social");
      runFullGeneration(dmmf);
    },
    {
      iterations: 30,
      warmupIterations: 5,
    },
  );
});

describe("Scaling Analysis", () => {
  bench(
    "Models per second - Small",
    async () => {
      const { dmmf, info } = await loadSchema("small");
      const start = performance.now();
      runFullGeneration(dmmf);
      const duration = performance.now() - start;
      const modelsPerSec = (info.stats.models / duration) * 1000;
      console.log(`  Small: ${modelsPerSec.toFixed(2)} models/sec`);
    },
    { iterations: 20 },
  );

  bench(
    "Models per second - Medium",
    async () => {
      const { dmmf, info } = await loadSchema("medium");
      const start = performance.now();
      runFullGeneration(dmmf);
      const duration = performance.now() - start;
      const modelsPerSec = (info.stats.models / duration) * 1000;
      console.log(`  Medium: ${modelsPerSec.toFixed(2)} models/sec`);
    },
    { iterations: 20 },
  );

  bench(
    "Models per second - Large",
    async () => {
      const { dmmf, info } = await loadSchema("large");
      const start = performance.now();
      runFullGeneration(dmmf);
      const duration = performance.now() - start;
      const modelsPerSec = (info.stats.models / duration) * 1000;
      console.log(`  Large: ${modelsPerSec.toFixed(2)} models/sec`);
    },
    { iterations: 10 },
  );
});
