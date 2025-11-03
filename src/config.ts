import { ArkErrors, type } from "arktype";

const configSchema = type({
  output: "string = './prisma/generated/validators'",
  arktypeImportDependencyName: "string = 'arktype'",
  ignoredKeysOnInputModels: "string[]",
});

export type Config = typeof configSchema.infer;

let config: Config = {
  output: "./prisma/generated/validators",
  arktypeImportDependencyName: "arktype",
  ignoredKeysOnInputModels: ["id", "createdAt", "updatedAt"],
};

const configPartialSchema = configSchema.partial();

export function setConfig(newConfig: unknown) {
  const out = configPartialSchema(newConfig);
  if (out instanceof ArkErrors) {
    throw new Error(`Invalid generator config:\n${out.toString()}`);
  }
  config = { ...config, ...out };

  // only allow single mutation
  Object.freeze(config);
}

export function getConfig(): Config {
  return config;
}
