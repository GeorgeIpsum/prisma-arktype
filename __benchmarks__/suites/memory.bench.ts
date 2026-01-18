/**
 * Memory Profiling Benchmarks
 * Measures heap usage and memory growth during generation
 * Run with: node --expose-gc node_modules/.bin/vitest bench --grep memory
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
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Get memory usage stats
 */
function getMemoryStats() {
  if (global.gc) {
    global.gc();
  }
  const usage = process.memoryUsage();
  return {
    heapUsed: usage.heapUsed,
    heapTotal: usage.heapTotal,
    external: usage.external,
    rss: usage.rss,
  };
}

/**
 * Run full generation pipeline
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

describe("Memory Usage - Schema Size Impact", () => {
  bench(
    "Small schema memory footprint",
    async () => {
      const before = getMemoryStats();
      const { dmmf } = await loadSchema("small");
      runFullGeneration(dmmf);
      const after = getMemoryStats();

      const growth = after.heapUsed - before.heapUsed;
      console.log(`\n  Heap growth: ${formatBytes(growth)}`);
      console.log(`  Heap used: ${formatBytes(after.heapUsed)}`);
      console.log(`  RSS: ${formatBytes(after.rss)}`);
    },
    { iterations: 10 },
  );

  bench(
    "Medium schema memory footprint",
    async () => {
      const before = getMemoryStats();
      const { dmmf } = await loadSchema("medium");
      runFullGeneration(dmmf);
      const after = getMemoryStats();

      const growth = after.heapUsed - before.heapUsed;
      console.log(`\n  Heap growth: ${formatBytes(growth)}`);
      console.log(`  Heap used: ${formatBytes(after.heapUsed)}`);
      console.log(`  RSS: ${formatBytes(after.rss)}`);
    },
    { iterations: 10 },
  );

  bench(
    "Large schema memory footprint",
    async () => {
      const before = getMemoryStats();
      const { dmmf } = await loadSchema("large");
      runFullGeneration(dmmf);
      const after = getMemoryStats();

      const growth = after.heapUsed - before.heapUsed;
      console.log(`\n  Heap growth: ${formatBytes(growth)}`);
      console.log(`  Heap used: ${formatBytes(after.heapUsed)}`);
      console.log(`  RSS: ${formatBytes(after.rss)}`);
    },
    { iterations: 5 },
  );
});

describe("Memory Efficiency - Per Model", () => {
  bench(
    "Memory per model - Small",
    async () => {
      const before = getMemoryStats();
      const { dmmf, info } = await loadSchema("small");
      runFullGeneration(dmmf);
      const after = getMemoryStats();

      const growth = after.heapUsed - before.heapUsed;
      const perModel = growth / info.stats.models;
      console.log(
        `\n  ${formatBytes(perModel)} per model (${info.stats.models} models)`,
      );
    },
    { iterations: 10 },
  );

  bench(
    "Memory per model - Medium",
    async () => {
      const before = getMemoryStats();
      const { dmmf, info } = await loadSchema("medium");
      runFullGeneration(dmmf);
      const after = getMemoryStats();

      const growth = after.heapUsed - before.heapUsed;
      const perModel = growth / info.stats.models;
      console.log(
        `\n  ${formatBytes(perModel)} per model (${info.stats.models} models)`,
      );
    },
    { iterations: 10 },
  );

  bench(
    "Memory per model - Large",
    async () => {
      const before = getMemoryStats();
      const { dmmf, info } = await loadSchema("large");
      runFullGeneration(dmmf);
      const after = getMemoryStats();

      const growth = after.heapUsed - before.heapUsed;
      const perModel = growth / info.stats.models;
      console.log(
        `\n  ${formatBytes(perModel)} per model (${info.stats.models} models)`,
      );
    },
    { iterations: 5 },
  );
});

describe("Memory Leaks Detection", () => {
  bench(
    "Repeated generation - memory stability",
    async () => {
      const { dmmf } = await loadSchema("medium");

      // Warmup
      runFullGeneration(dmmf);
      const baseline = getMemoryStats();

      // Run 10 times
      for (let i = 0; i < 10; i++) {
        runFullGeneration(dmmf);
      }

      const after = getMemoryStats();
      const growth = after.heapUsed - baseline.heapUsed;

      console.log(`\n  Baseline: ${formatBytes(baseline.heapUsed)}`);
      console.log(`  After 10 runs: ${formatBytes(after.heapUsed)}`);
      console.log(`  Growth: ${formatBytes(growth)}`);

      if (growth > 1024 * 1024) {
        // More than 1MB growth
        console.log("  ⚠️  Potential memory leak detected!");
      } else {
        console.log("  ✓ Memory stable");
      }
    },
    { iterations: 5 },
  );
});

describe("Processor Memory Usage", () => {
  bench(
    "processWhere memory",
    async () => {
      const { dmmf } = await loadSchema("large");
      const before = getMemoryStats();
      processWhere(dmmf.datamodel.models);
      const after = getMemoryStats();
      console.log(
        `\n  processWhere: ${formatBytes(after.heapUsed - before.heapUsed)}`,
      );
    },
    { iterations: 10 },
  );

  bench(
    "processPlain memory",
    async () => {
      const { dmmf } = await loadSchema("large");
      const before = getMemoryStats();
      processPlain(dmmf.datamodel.models);
      const after = getMemoryStats();
      console.log(
        `\n  processPlain: ${formatBytes(after.heapUsed - before.heapUsed)}`,
      );
    },
    { iterations: 10 },
  );

  bench(
    "processRelations memory",
    async () => {
      const { dmmf } = await loadSchema("large");
      const before = getMemoryStats();
      processRelations(dmmf.datamodel.models);
      const after = getMemoryStats();
      console.log(
        `\n  processRelations: ${formatBytes(after.heapUsed - before.heapUsed)}`,
      );
    },
    { iterations: 10 },
  );
});

describe("Peak Memory Usage", () => {
  bench(
    "Extreme schema memory requirement",
    async () => {
      const initial = getMemoryStats();
      console.log(`\n  Initial heap: ${formatBytes(initial.heapUsed)}`);

      const { dmmf, info } = await loadSchema("extreme");
      console.log(
        `  After loading DMMF: ${formatBytes(getMemoryStats().heapUsed)}`,
      );

      const beforeGen = getMemoryStats();
      runFullGeneration(dmmf);
      const afterGen = getMemoryStats();

      console.log(`  After generation: ${formatBytes(afterGen.heapUsed)}`);
      console.log(`  Peak heap: ${formatBytes(afterGen.heapTotal)}`);
      console.log(`  Peak RSS: ${formatBytes(afterGen.rss)}`);
      console.log(
        `  Generation cost: ${formatBytes(afterGen.heapUsed - beforeGen.heapUsed)}`,
      );
      console.log(`  Models processed: ${info.stats.models}`);
    },
    { iterations: 3 },
  );
});

describe("Realistic Workload Memory", () => {
  bench(
    "E-commerce schema",
    async () => {
      const before = getMemoryStats();
      const { dmmf, info } = await loadRealisticSchema("ecommerce");
      runFullGeneration(dmmf);
      const after = getMemoryStats();

      const growth = after.heapUsed - before.heapUsed;
      console.log(
        `\n  E-commerce (${info.stats.models} models): ${formatBytes(growth)}`,
      );
    },
    { iterations: 10 },
  );

  bench(
    "SaaS schema",
    async () => {
      const before = getMemoryStats();
      const { dmmf, info } = await loadRealisticSchema("saas");
      runFullGeneration(dmmf);
      const after = getMemoryStats();

      const growth = after.heapUsed - before.heapUsed;
      console.log(
        `\n  SaaS (${info.stats.models} models): ${formatBytes(growth)}`,
      );
    },
    { iterations: 10 },
  );

  bench(
    "Social network schema",
    async () => {
      const before = getMemoryStats();
      const { dmmf, info } = await loadRealisticSchema("social");
      runFullGeneration(dmmf);
      const after = getMemoryStats();

      const growth = after.heapUsed - before.heapUsed;
      console.log(
        `\n  Social (${info.stats.models} models): ${formatBytes(growth)}`,
      );
    },
    { iterations: 10 },
  );
});
