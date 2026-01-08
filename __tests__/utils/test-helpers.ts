import { type } from "arktype";
import { TEST_FIXTURES } from "../config/model-mapping";

/**
 * Dynamically import a validator for a given model and variant
 */
export async function loadValidator(
  modelName: string,
  variant:
    | "Plain"
    | "Create"
    | "Update"
    | "Where"
    | "WhereUnique"
    | "Relations"
    | "Select"
    | "Include"
    | "OrderBy"
    | "" = "",
) {
  const validatorName = `${modelName}${variant}`;
  const path = `../../prisma/generated/validators/${validatorName}`;

  try {
    const module = await import(path);
    return module[validatorName];
  } catch (error) {
    throw new Error(
      `Failed to load validator ${validatorName} from ${path}: ${error}`,
    );
  }
}

/**
 * Load an enum validator
 */
export async function loadEnumValidator(enumName: string) {
  const path = `../../prisma/generated/validators/${enumName}`;

  try {
    const module = await import(path);
    return module[enumName];
  } catch (error) {
    throw new Error(`Failed to load enum ${enumName}: ${error}`);
  }
}

/**
 * Check if validation passed (not type.errors)
 */
export function isValidationSuccess(result: unknown): boolean {
  return !(result instanceof type.errors);
}

/**
 * Check if validation failed (is type.errors)
 */
export function isValidationError(result: unknown): result is type.errors {
  return result instanceof type.errors;
}

/**
 * Get test fixture for a model
 */
export function getFixture<K extends keyof typeof TEST_FIXTURES>(
  modelName: K,
): (typeof TEST_FIXTURES)[K] {
  return TEST_FIXTURES[modelName];
}

/**
 * Create a partial fixture (for update/where tests)
 */
export function getPartialFixture<K extends keyof typeof TEST_FIXTURES>(
  modelName: K,
  fields: Array<keyof (typeof TEST_FIXTURES)[K]>,
): Partial<(typeof TEST_FIXTURES)[K]> {
  const fixture = TEST_FIXTURES[modelName];
  return fields.reduce(
    (acc, field) => {
      acc[field] = fixture[field];
      return acc;
    },
    {} as Partial<(typeof TEST_FIXTURES)[K]>,
  );
}
