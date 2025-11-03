import { access, mkdir, rm } from "node:fs/promises";
import { generatorHandler } from "@prisma/generator-helper";
import { getConfig, setConfig } from "./config";
import { processCreate } from "./generators/create";
import { processEnums } from "./generators/enum";
import { processInclude } from "./generators/include";
import { processOrderBy } from "./generators/orderBy";
import { processPlain } from "./generators/plain";
import {
  processRelations,
  processRelationsCreate,
  processRelationsUpdate,
} from "./generators/relations";
import { processSelect } from "./generators/select";
import { processUpdate } from "./generators/update";
import { processWhere } from "./generators/where";

generatorHandler({
  onManifest(config) {
    return {
      defaultOutput: "./prisma/generated/validators",
      prettyName: "prismaark",
    };
  },
  async onGenerate(options) {
    setConfig({
      ...options.generator.config,
      output: options.generator.output?.value,
    });

    try {
      await access(getConfig().output);
      await rm(getConfig().output, { recursive: true });
    } catch {
      console.error("Output directory does not exist, creating a new one.");
    }

    await mkdir(getConfig().output, { recursive: true });

    processEnums(options.dmmf.datamodel.enums);
    processPlain(options.dmmf.datamodel.models);
    processWhere(options.dmmf.datamodel.models);
    processCreate(options.dmmf.datamodel.models);
    processUpdate(options.dmmf.datamodel.models);
    processSelect(options.dmmf.datamodel.models);
    processInclude(options.dmmf.datamodel.models);
    processOrderBy(options.dmmf.datamodel.models);
    processRelations(options.dmmf.datamodel.models);
    processRelationsCreate(options.dmmf.datamodel.models);
    processRelationsUpdate(options.dmmf.datamodel.models);
  },
});
