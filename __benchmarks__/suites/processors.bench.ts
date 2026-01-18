/**
 * Individual Processor Benchmarks
 * Tests each of the 11 generators separately to identify bottlenecks
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

describe("Processor Performance - Medium Schema", () => {
  bench("processEnums", async () => {
    const { dmmf } = await loadSchema("medium");
    processEnums(dmmf.datamodel.enums);
  });

  bench("processPlain", async () => {
    const { dmmf } = await loadSchema("medium");
    processPlain(dmmf.datamodel.models);
  });

  bench("processWhere", async () => {
    const { dmmf } = await loadSchema("medium");
    processWhere(dmmf.datamodel.models);
  });

  bench("processCreate", async () => {
    const { dmmf } = await loadSchema("medium");
    processCreate(dmmf.datamodel.models);
  });

  bench("processUpdate", async () => {
    const { dmmf } = await loadSchema("medium");
    processUpdate(dmmf.datamodel.models);
  });

  bench("processSelect", async () => {
    const { dmmf } = await loadSchema("medium");
    processSelect(dmmf.datamodel.models);
  });

  bench("processInclude", async () => {
    const { dmmf } = await loadSchema("medium");
    processInclude(dmmf.datamodel.models);
  });

  bench("processOrderBy", async () => {
    const { dmmf } = await loadSchema("medium");
    processOrderBy(dmmf.datamodel.models);
  });

  bench("processRelations", async () => {
    const { dmmf } = await loadSchema("medium");
    processRelations(dmmf.datamodel.models);
  });

  bench("processRelationsCreate", async () => {
    const { dmmf } = await loadSchema("medium");
    processRelationsCreate(dmmf.datamodel.models);
  });

  bench("processRelationsUpdate", async () => {
    const { dmmf } = await loadSchema("medium");
    processRelationsUpdate(dmmf.datamodel.models);
  });
});

describe("Processor Performance - Large Schema", () => {
  bench(
    "processEnums",
    async () => {
      const { dmmf } = await loadSchema("large");
      processEnums(dmmf.datamodel.enums);
    },
    { iterations: 10 },
  );

  bench(
    "processPlain",
    async () => {
      const { dmmf } = await loadSchema("large");
      processPlain(dmmf.datamodel.models);
    },
    { iterations: 10 },
  );

  bench(
    "processWhere",
    async () => {
      const { dmmf } = await loadSchema("large");
      processWhere(dmmf.datamodel.models);
    },
    { iterations: 10 },
  );

  bench(
    "processCreate",
    async () => {
      const { dmmf } = await loadSchema("large");
      processCreate(dmmf.datamodel.models);
    },
    { iterations: 10 },
  );

  bench(
    "processUpdate",
    async () => {
      const { dmmf } = await loadSchema("large");
      processUpdate(dmmf.datamodel.models);
    },
    { iterations: 10 },
  );

  bench(
    "processSelect",
    async () => {
      const { dmmf } = await loadSchema("large");
      processSelect(dmmf.datamodel.models);
    },
    { iterations: 10 },
  );

  bench(
    "processInclude",
    async () => {
      const { dmmf } = await loadSchema("large");
      processInclude(dmmf.datamodel.models);
    },
    { iterations: 10 },
  );

  bench(
    "processOrderBy",
    async () => {
      const { dmmf } = await loadSchema("large");
      processOrderBy(dmmf.datamodel.models);
    },
    { iterations: 10 },
  );

  bench(
    "processRelations",
    async () => {
      const { dmmf } = await loadSchema("large");
      processRelations(dmmf.datamodel.models);
    },
    { iterations: 10 },
  );

  bench(
    "processRelationsCreate",
    async () => {
      const { dmmf } = await loadSchema("large");
      processRelationsCreate(dmmf.datamodel.models);
    },
    { iterations: 10 },
  );

  bench(
    "processRelationsUpdate",
    async () => {
      const { dmmf } = await loadSchema("large");
      processRelationsUpdate(dmmf.datamodel.models);
    },
    { iterations: 10 },
  );
});

describe("Processor Scaling - Small vs Large", () => {
  bench(
    "processWhere - Small (5 models)",
    async () => {
      const { dmmf } = await loadSchema("small");
      processWhere(dmmf.datamodel.models);
    },
    { iterations: 50 },
  );

  bench(
    "processWhere - Large (100 models)",
    async () => {
      const { dmmf } = await loadSchema("large");
      processWhere(dmmf.datamodel.models);
    },
    { iterations: 10 },
  );

  bench(
    "processPlain - Small (5 models)",
    async () => {
      const { dmmf } = await loadSchema("small");
      processPlain(dmmf.datamodel.models);
    },
    { iterations: 50 },
  );

  bench(
    "processPlain - Large (100 models)",
    async () => {
      const { dmmf } = await loadSchema("large");
      processPlain(dmmf.datamodel.models);
    },
    { iterations: 10 },
  );
});

describe("Relative Processor Cost", () => {
  bench(
    "All processors on small schema",
    async () => {
      const { dmmf } = await loadSchema("small");

      const timings = {
        enums: 0,
        plain: 0,
        where: 0,
        create: 0,
        update: 0,
        select: 0,
        include: 0,
        orderBy: 0,
        relations: 0,
        relationsCreate: 0,
        relationsUpdate: 0,
      };

      let start = performance.now();
      processEnums(dmmf.datamodel.enums);
      timings.enums = performance.now() - start;

      start = performance.now();
      processPlain(dmmf.datamodel.models);
      timings.plain = performance.now() - start;

      start = performance.now();
      processWhere(dmmf.datamodel.models);
      timings.where = performance.now() - start;

      start = performance.now();
      processCreate(dmmf.datamodel.models);
      timings.create = performance.now() - start;

      start = performance.now();
      processUpdate(dmmf.datamodel.models);
      timings.update = performance.now() - start;

      start = performance.now();
      processSelect(dmmf.datamodel.models);
      timings.select = performance.now() - start;

      start = performance.now();
      processInclude(dmmf.datamodel.models);
      timings.include = performance.now() - start;

      start = performance.now();
      processOrderBy(dmmf.datamodel.models);
      timings.orderBy = performance.now() - start;

      start = performance.now();
      processRelations(dmmf.datamodel.models);
      timings.relations = performance.now() - start;

      start = performance.now();
      processRelationsCreate(dmmf.datamodel.models);
      timings.relationsCreate = performance.now() - start;

      start = performance.now();
      processRelationsUpdate(dmmf.datamodel.models);
      timings.relationsUpdate = performance.now() - start;

      // Find slowest processor
      const sorted = Object.entries(timings).sort((a, b) => b[1] - a[1]);
      console.log("\n  Processor timings (slowest first):");
      for (const [name, time] of sorted) {
        console.log(`    ${name}: ${time.toFixed(3)}ms`);
      }
    },
    { iterations: 20 },
  );
});
