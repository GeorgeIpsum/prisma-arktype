import { describe, expect, it } from "vitest";
import { TEST_MODEL_MAP } from "./config/model-mapping";
import { isValidationSuccess, loadValidator } from "./utils/test-helpers";
import type { Prisma } from "../prisma/generated/client/client";

/**
 * These tests verify TypeScript validity of schema outputs against the Prisma client.
 * They demonstrate that validated outputs from ArkType schemas can be safely used
 * in Prisma client queries (select, where, include, etc.).
 *
 * Note: These tests focus on TypeScript type compatibility and validation.
 * They do NOT require a running database - they verify that the types align correctly.
 */

describe("Prisma Client TypeScript Compatibility", () => {
  describe("Where Clause Validation", () => {
    const MODEL = TEST_MODEL_MAP.BASIC_MODEL;

    it("should validate where clause and be type-compatible with Prisma client", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      // Validate a where clause using our schema
      const whereClause = {
        email: "test@example.com",
        isActive: true,
      };

      const validationResult = WhereValidator(whereClause);
      expect(isValidationSuccess(validationResult)).toBe(true);

      // TypeScript check: verified output should be assignable to Prisma's where type
      if (isValidationSuccess(validationResult)) {
        // This line verifies TypeScript compatibility - if it compiles, the types match
        const prismaWhere: Prisma.TestUserWhereInput = validationResult;
        expect(prismaWhere).toBeDefined();
        expect(prismaWhere.email).toBe("test@example.com");
        expect(prismaWhere.isActive).toBe(true);
      }
    });

    it("should validate complex where clause with filters and be compatible with Prisma client", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      // Complex where clause with string filters (using phoneNumber which doesn't have typeOverwrite)
      const whereClause = {
        phoneNumber: {
          contains: "+1234",
        },
        isActive: true,
      };

      const validationResult = WhereValidator(whereClause);
      expect(isValidationSuccess(validationResult)).toBe(true);

      if (isValidationSuccess(validationResult)) {
        // Verify TypeScript compatibility with Prisma's StringFilter type
        const prismaWhere: Prisma.TestUserWhereInput = validationResult;
        expect(prismaWhere).toBeDefined();

        // Ensure the filter structure is preserved
        if (
          typeof prismaWhere.phoneNumber === "object" &&
          prismaWhere.phoneNumber !== null
        ) {
          expect(prismaWhere.phoneNumber.contains).toBe("+1234");
        }
      }
    });

    it("should validate where clause with date filters compatible with Prisma client", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");

      const startDate = new Date("2024-01-01");
      const endDate = new Date("2024-12-31");

      const whereClause = {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      };

      const validationResult = WhereValidator(whereClause);
      expect(isValidationSuccess(validationResult)).toBe(true);

      if (isValidationSuccess(validationResult)) {
        const prismaWhere: Prisma.TestUserWhereInput = validationResult;
        expect(prismaWhere).toBeDefined();

        if (
          typeof prismaWhere.createdAt === "object" &&
          prismaWhere.createdAt !== null &&
          !(prismaWhere.createdAt instanceof Date)
        ) {
          expect(prismaWhere.createdAt.gte).toEqual(startDate);
          expect(prismaWhere.createdAt.lte).toEqual(endDate);
        }
      }
    });

    it("should validate WhereUnique and be compatible with Prisma client findUnique", async () => {
      const WhereUniqueValidator = await loadValidator(MODEL, "WhereUnique");

      const whereUnique = {
        email: "unique@example.com",
      };

      const validationResult = WhereUniqueValidator(whereUnique);
      expect(isValidationSuccess(validationResult)).toBe(true);

      if (isValidationSuccess(validationResult)) {
        const prismaWhereUnique: Prisma.TestUserWhereUniqueInput =
          validationResult;
        expect(prismaWhereUnique).toBeDefined();
        expect(prismaWhereUnique.email).toBe("unique@example.com");
      }
    });
  });

  describe("Select Clause Validation", () => {
    const MODEL = TEST_MODEL_MAP.BASIC_MODEL;

    it("should validate select clause and be type-compatible with Prisma client", async () => {
      const SelectValidator = await loadValidator(MODEL, "Select");

      const selectClause = {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      };

      const validationResult = SelectValidator(selectClause);
      expect(isValidationSuccess(validationResult)).toBe(true);

      if (isValidationSuccess(validationResult)) {
        // TypeScript check: verified output should be assignable to Prisma's select type
        const prismaSelect: Prisma.TestUserSelect = validationResult;
        expect(prismaSelect).toBeDefined();
        expect(prismaSelect.id).toBe(true);
        expect(prismaSelect.email).toBe(true);
        expect(prismaSelect.name).toBe(true);
      }
    });

    it("should validate partial select clause compatible with Prisma client", async () => {
      const SelectValidator = await loadValidator(MODEL, "Select");

      const selectClause = {
        email: true,
        isActive: true,
      };

      const validationResult = SelectValidator(selectClause);
      expect(isValidationSuccess(validationResult)).toBe(true);

      if (isValidationSuccess(validationResult)) {
        const prismaSelect: Prisma.TestUserSelect = validationResult;
        expect(prismaSelect).toBeDefined();
        expect(prismaSelect.email).toBe(true);
        expect(prismaSelect.isActive).toBe(true);
      }
    });

    it("should validate select with false values compatible with Prisma client", async () => {
      const SelectValidator = await loadValidator(MODEL, "Select");

      const selectClause = {
        id: true,
        email: false, // Explicitly excluding
        name: true,
      };

      const validationResult = SelectValidator(selectClause);
      expect(isValidationSuccess(validationResult)).toBe(true);

      if (isValidationSuccess(validationResult)) {
        const prismaSelect: Prisma.TestUserSelect = validationResult;
        expect(prismaSelect).toBeDefined();
        expect(prismaSelect.id).toBe(true);
        expect(prismaSelect.email).toBe(false);
      }
    });
  });

  describe("Include Clause Validation", () => {
    const MODEL = TEST_MODEL_MAP.MODEL_WITH_RELATIONS;

    it("should validate include clause and be type-compatible with Prisma client", async () => {
      const IncludeValidator = await loadValidator(MODEL, "Include");

      const includeClause = {
        posts: true,
        profile: true,
      };

      const validationResult = IncludeValidator(includeClause);
      expect(isValidationSuccess(validationResult)).toBe(true);

      if (isValidationSuccess(validationResult)) {
        // TypeScript check: verified output should be assignable to Prisma's include type
        const prismaInclude: Prisma.TestUserInclude = validationResult;
        expect(prismaInclude).toBeDefined();
        expect(prismaInclude.posts).toBe(true);
        expect(prismaInclude.profile).toBe(true);
      }
    });

    it("should validate partial include clause compatible with Prisma client", async () => {
      const IncludeValidator = await loadValidator(MODEL, "Include");

      const includeClause = {
        posts: true,
      };

      const validationResult = IncludeValidator(includeClause);
      expect(isValidationSuccess(validationResult)).toBe(true);

      if (isValidationSuccess(validationResult)) {
        const prismaInclude: Prisma.TestUserInclude = validationResult;
        expect(prismaInclude).toBeDefined();
        expect(prismaInclude.posts).toBe(true);
      }
    });

    it("should validate include with false values compatible with Prisma client", async () => {
      const IncludeValidator = await loadValidator(MODEL, "Include");

      const includeClause = {
        posts: true,
        profile: false, // Explicitly excluding
      };

      const validationResult = IncludeValidator(includeClause);
      expect(isValidationSuccess(validationResult)).toBe(true);

      if (isValidationSuccess(validationResult)) {
        const prismaInclude: Prisma.TestUserInclude = validationResult;
        expect(prismaInclude).toBeDefined();
        expect(prismaInclude.posts).toBe(true);
        expect(prismaInclude.profile).toBe(false);
      }
    });
  });

  describe("Combined Query Validation", () => {
    const MODEL = TEST_MODEL_MAP.BASIC_MODEL;

    it("should validate where + select combination compatible with Prisma findMany", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");
      const SelectValidator = await loadValidator(MODEL, "Select");

      // Validate where clause
      const whereClause = {
        isActive: true,
      };

      const whereResult = WhereValidator(whereClause);
      expect(isValidationSuccess(whereResult)).toBe(true);

      // Validate select clause
      const selectClause = {
        id: true,
        email: true,
        name: true,
      };

      const selectResult = SelectValidator(selectClause);
      expect(isValidationSuccess(selectResult)).toBe(true);

      // Both should be compatible with Prisma's findMany args
      if (
        isValidationSuccess(whereResult) &&
        isValidationSuccess(selectResult)
      ) {
        const prismaArgs: Prisma.TestUserFindManyArgs = {
          where: whereResult,
          select: selectResult,
        };

        expect(prismaArgs).toBeDefined();
        expect(prismaArgs.where).toBeDefined();
        expect(prismaArgs.select).toBeDefined();
      }
    });

    it("should validate where + include combination compatible with Prisma findMany", async () => {
      const WhereValidator = await loadValidator(MODEL, "Where");
      const IncludeValidator = await loadValidator(MODEL, "Include");

      const whereClause = {
        isActive: true,
      };

      const whereResult = WhereValidator(whereClause);
      expect(isValidationSuccess(whereResult)).toBe(true);

      const includeClause = {
        posts: true,
        profile: true,
      };

      const includeResult = IncludeValidator(includeClause);
      expect(isValidationSuccess(includeResult)).toBe(true);

      if (
        isValidationSuccess(whereResult) &&
        isValidationSuccess(includeResult)
      ) {
        const prismaArgs: Prisma.TestUserFindManyArgs = {
          where: whereResult,
          include: includeResult,
        };

        expect(prismaArgs).toBeDefined();
        expect(prismaArgs.where).toBeDefined();
        expect(prismaArgs.include).toBeDefined();
      }
    });
  });

  describe("Real-world Query Pattern Validation", () => {
    it("should validate a complete findUnique query with select", async () => {
      const WhereUniqueValidator = await loadValidator(
        TEST_MODEL_MAP.BASIC_MODEL,
        "WhereUnique",
      );
      const SelectValidator = await loadValidator(
        TEST_MODEL_MAP.BASIC_MODEL,
        "Select",
      );

      const where = { email: "user@example.com" };
      const select = { id: true, name: true, email: true };

      const whereResult = WhereUniqueValidator(where);
      const selectResult = SelectValidator(select);

      expect(isValidationSuccess(whereResult)).toBe(true);
      expect(isValidationSuccess(selectResult)).toBe(true);

      if (
        isValidationSuccess(whereResult) &&
        isValidationSuccess(selectResult)
      ) {
        // This would be used in a real Prisma query like:
        // await prisma.testUser.findUnique({ where, select })
        const findUniqueArgs: Prisma.TestUserFindUniqueArgs = {
          where: whereResult,
          select: selectResult,
        };

        expect(findUniqueArgs).toBeDefined();
      }
    });

    it("should validate a complete findFirst query with where and include", async () => {
      const WhereValidator = await loadValidator(
        TEST_MODEL_MAP.BASIC_MODEL,
        "Where",
      );
      const IncludeValidator = await loadValidator(
        TEST_MODEL_MAP.BASIC_MODEL,
        "Include",
      );

      const where = {
        isActive: true,
      };

      const include = {
        posts: true,
        profile: true,
      };

      const whereResult = WhereValidator(where);
      const includeResult = IncludeValidator(include);

      expect(isValidationSuccess(whereResult)).toBe(true);
      expect(isValidationSuccess(includeResult)).toBe(true);

      if (
        isValidationSuccess(whereResult) &&
        isValidationSuccess(includeResult)
      ) {
        // This would be used in a real Prisma query like:
        // await prisma.testUser.findFirst({ where, include })
        const findFirstArgs: Prisma.TestUserFindFirstArgs = {
          where: whereResult,
          include: includeResult,
        };

        expect(findFirstArgs).toBeDefined();
      }
    });

    it("should validate a complete findMany query with complex filters", async () => {
      const WhereValidator = await loadValidator(
        TEST_MODEL_MAP.BASIC_MODEL,
        "Where",
      );
      const SelectValidator = await loadValidator(
        TEST_MODEL_MAP.BASIC_MODEL,
        "Select",
      );

      const where = {
        AND: [
          { isActive: true },
          {
            createdAt: {
              gte: new Date("2024-01-01"),
            },
          },
        ],
      };

      const select = {
        id: true,
        email: true,
        createdAt: true,
      };

      const whereResult = WhereValidator(where);
      const selectResult = SelectValidator(select);

      expect(isValidationSuccess(whereResult)).toBe(true);
      expect(isValidationSuccess(selectResult)).toBe(true);

      if (
        isValidationSuccess(whereResult) &&
        isValidationSuccess(selectResult)
      ) {
        // This would be used in a real Prisma query like:
        // await prisma.testUser.findMany({ where, select })
        const findManyArgs: Prisma.TestUserFindManyArgs = {
          where: whereResult,
          select: selectResult,
        };

        expect(findManyArgs).toBeDefined();
      }
    });
  });

  describe("OrderBy Validation", () => {
    it("should validate orderBy clause and be compatible with Prisma client", async () => {
      const OrderByValidator = await loadValidator(
        TEST_MODEL_MAP.BASIC_MODEL,
        "OrderBy",
      );

      const orderBy = {
        createdAt: "desc" as const,
        email: "asc" as const,
      };

      const validationResult = OrderByValidator(orderBy);
      expect(isValidationSuccess(validationResult)).toBe(true);

      if (isValidationSuccess(validationResult)) {
        // TypeScript check: verified output should be assignable to Prisma's orderBy type
        const prismaOrderBy: Prisma.TestUserOrderByWithRelationInput =
          validationResult;
        expect(prismaOrderBy).toBeDefined();
        expect(prismaOrderBy.createdAt).toBe("desc");
        expect(prismaOrderBy.email).toBe("asc");
      }
    });

    it("should validate orderBy in complete findMany query", async () => {
      const WhereValidator = await loadValidator(
        TEST_MODEL_MAP.BASIC_MODEL,
        "Where",
      );
      const OrderByValidator = await loadValidator(
        TEST_MODEL_MAP.BASIC_MODEL,
        "OrderBy",
      );
      const SelectValidator = await loadValidator(
        TEST_MODEL_MAP.BASIC_MODEL,
        "Select",
      );

      const where = { isActive: true };
      const orderBy = { createdAt: "desc" as const };
      const select = { id: true, email: true, createdAt: true };

      const whereResult = WhereValidator(where);
      const orderByResult = OrderByValidator(orderBy);
      const selectResult = SelectValidator(select);

      expect(isValidationSuccess(whereResult)).toBe(true);
      expect(isValidationSuccess(orderByResult)).toBe(true);
      expect(isValidationSuccess(selectResult)).toBe(true);

      if (
        isValidationSuccess(whereResult) &&
        isValidationSuccess(orderByResult) &&
        isValidationSuccess(selectResult)
      ) {
        // This would be used in a real Prisma query like:
        // await prisma.testUser.findMany({ where, orderBy, select })
        const findManyArgs: Prisma.TestUserFindManyArgs = {
          where: whereResult,
          orderBy: orderByResult,
          select: selectResult,
        };

        expect(findManyArgs).toBeDefined();
        expect(findManyArgs.orderBy).toBeDefined();
      }
    });
  });

  describe("Type Safety Verification", () => {
    it("should demonstrate type errors are caught at compile time", async () => {
      const WhereValidator = await loadValidator(
        TEST_MODEL_MAP.BASIC_MODEL,
        "Where",
      );

      // Invalid where clause - wrong type
      const invalidWhere = {
        email: 123, // Should be string, not number
      };

      const validationResult = WhereValidator(invalidWhere);

      // Runtime validation should fail
      expect(isValidationSuccess(validationResult)).toBe(false);

      // Note: TypeScript would also catch this at compile time if we
      // were using the schema's inferred types directly
    });

    it("should demonstrate validated data maintains correct types", async () => {
      const WhereValidator = await loadValidator(
        TEST_MODEL_MAP.BASIC_MODEL,
        "Where",
      );

      const whereClause = {
        email: "test@example.com",
        isActive: true,
        createdAt: {
          gte: new Date("2024-01-01"),
        },
      };

      const validationResult = WhereValidator(whereClause);
      expect(isValidationSuccess(validationResult)).toBe(true);

      if (isValidationSuccess(validationResult)) {
        // Verify types are preserved correctly
        expect(typeof validationResult.email).toBe("string");
        expect(typeof validationResult.isActive).toBe("boolean");

        if (
          typeof validationResult.createdAt === "object" &&
          validationResult.createdAt !== null
        ) {
          expect(validationResult.createdAt.gte).toBeInstanceOf(Date);
        }
      }
    });
  });
});

/**
 * Integration example showing how validated schemas would be used in practice:
 *
 * ```typescript
 * import { type } from 'arktype';
 * import { PrismaClient } from '@prisma/client';
 * import { TestUserWhere, TestUserSelect } from './generated/validators';
 *
 * const prisma = new PrismaClient();
 *
 * // Validate user input
 * const whereInput = req.body.where;
 * const whereResult = TestUserWhere(whereInput);
 *
 * if (whereResult instanceof type.errors) {
 *   throw new Error(whereResult.summary);
 * }
 *
 * // Use validated data in Prisma query
 * const users = await prisma.testUser.findMany({
 *   where: whereResult, // Type-safe and validated!
 *   select: { id: true, email: true }
 * });
 * ```
 */
