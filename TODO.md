# prisma-arktype TODO

This document tracks features needed to achieve full feature parity with [prisma-zod-generator](https://github.com/omar-dulaimi/prisma-zod-generator).

## Current Implementation Status

### ✅ Completed Features
- [x] Basic schema generation (Plain, Relations, Where, WhereUnique, Create, Update, Select, Include, OrderBy)
- [x] Core configuration options (`output`, `arktypeImportDependencyName`, `ignoredKeysOnInputModels`)
- [x] Hide annotations (`@prisma-arktype.hide`, `@prisma-arktype.input.hide`, etc.)
- [x] Type overwrite annotation (`@prisma-arktype.typeOverwrite`)
- [x] Custom options/pipes annotation (`@prisma-arktype.options`)
- [x] Automatic generation on `prisma generate`
- [x] Basic type mapping (String, Int, BigInt, Float, Decimal, Boolean, DateTime, Json, Bytes, Enums)

---

## 🔴 High Priority (Core Parity)

### Rich Validation Annotations

#### String Validators
- [ ] Add `@prisma-arktype.string.min()` annotation with optional custom error message
- [ ] Add `@prisma-arktype.string.max()` annotation with optional custom error message
  - [ ] Alternatively parse the `db.varchar` argument and make sure this is reflected in the generated schema
- [ ] Add `@prisma-arktype.string.email()` annotation for email validation
- [ ] Add `@prisma-arktype.string.uuid()` annotation for UUID validation
- [ ] Add `@prisma-arktype.string.url()` annotation for URL validation
- [ ] Add `@prisma-arktype.string.regex()` annotation for pattern matching
- [ ] Add `@prisma-arktype.string.length()` annotation for exact length
- [ ] Add `@prisma-arktype.string.startsWith()` annotation
- [ ] Add `@prisma-arktype.string.endsWith()` annotation
- [ ] Add `@prisma-arktype.string.includes()` annotation
- [ ] Support chaining multiple string validators (e.g., `.email().max(255)`)

#### Number Validators
- [ ] Add `@prisma-arktype.number.lt()` annotation (less than)
- [ ] Add `@prisma-arktype.number.lte()` annotation (less than or equal)
- [ ] Add `@prisma-arktype.number.gt()` annotation (greater than)
- [ ] Add `@prisma-arktype.number.gte()` annotation (greater than or equal)
- [ ] Add `@prisma-arktype.number.int()` annotation (integer validation)
- [ ] Add `@prisma-arktype.number.positive()` annotation
- [ ] Add `@prisma-arktype.number.negative()` annotation
- [ ] Add `@prisma-arktype.number.nonpositive()` annotation
- [ ] Add `@prisma-arktype.number.nonnegative()` annotation
- [ ] Add `@prisma-arktype.number.multipleOf()` annotation
- [ ] Support custom error messages for all number validators

#### BigInt Validators
- [ ] Add `@prisma-arktype.bigint.lt()` annotation
- [ ] Add `@prisma-arktype.bigint.lte()` annotation
- [ ] Add `@prisma-arktype.bigint.gt()` annotation
- [ ] Add `@prisma-arktype.bigint.gte()` annotation
- [ ] Add `@prisma-arktype.bigint.positive()` annotation
- [ ] Add `@prisma-arktype.bigint.negative()` annotation
- [ ] Support custom error messages for bigint validators

#### Array Validators
- [ ] Add `@prisma-arktype.array.length()` annotation for exact array length
- [ ] Add `@prisma-arktype.array.min()` annotation for minimum array length
- [ ] Add `@prisma-arktype.array.max()` annotation for maximum array length
- [ ] Add `@prisma-arktype.array.nonempty()` annotation
- [ ] Support custom error messages for array validators

#### Date Validators
- [ ] Add `@prisma-arktype.date.min()` annotation for minimum date
- [ ] Add `@prisma-arktype.date.max()` annotation for maximum date
- [ ] Support custom error messages for date validators

### Custom Error Messages
- [ ] Support `{ message: "..." }` syntax for validator error messages
- [ ] Support `invalid_type_error` property for type-level errors
- [ ] Support `required_error` property for required field errors
- [ ] Support `description` property for field documentation

### JSON Configuration File Support
- [ ] Implement JSON config file auto-discovery (`zod-generator.config.json`, `prisma/config.json`, `config.json`)
- [ ] Support explicit config file path via generator option
- [ ] Implement configuration precedence (generator block > JSON file > defaults)
- [ ] Add config path resolution relative to schema file directory
- [ ] Add `warnOnFileLayoutConflicts` option for conflict detection
- [ ] Document JSON config file schema and usage

### Import External Validators
- [ ] Add `@prisma-arktype.import()` annotation to import custom validation functions
- [ ] Support array of import statements
- [ ] Enable using imported functions in custom validators
- [ ] Add configuration option for global imports
- [ ] Document import usage patterns and best practices

### Generation Modes
- [ ] Implement **Minimal Mode** - Generate only essential CRUD schemas
- [ ] Implement **Full Mode** - Generate complete ecosystem (all schema variants)
- [ ] Implement **Custom Mode** - Fine-grained control over what gets generated
- [ ] Add `generationMode` configuration option (`"minimal" | "full" | "custom"`)
- [ ] Document what each mode generates

### Enhanced Configuration Options
- [ ] Add `relationModel` option - Control relation generation (default: `true`)
- [ ] Add `modelCase` option - Output in PascalCase or camelCase (default: `"PascalCase"`)
- [ ] Add `modelSuffix` option - Custom suffix for model names (default: `"Model"`)
- [ ] Add `useDecimalJs` option - Use Decimal.js vs native number (default: `false`)
- [ ] Add `coerceDate` option - Control DateTime coercion behavior
- [ ] Add `writeNullishInModelTypes` option - Use `.nullish()` for nullable fields
- [ ] Add `prismaJsonNullability` option - Control JSON field nullability
- [ ] Update README with all configuration options and their defaults

---

## 🟡 Medium Priority (Enhanced Developer Experience)

### Advanced Annotations

#### Custom Validators
- [ ] Add `@prisma-arktype.custom.use()` annotation for complete custom validation
- [ ] Support `.refine()` in custom validators
- [ ] Support `.transform()` in custom validators
- [ ] Ensure `.optional()` and `.nullable()` are still added automatically

#### Omit Support
- [ ] Add `@prisma-arktype.custom.omit()` annotation
- [ ] Support omitting from specific schema types (e.g., `["input"]`, `["create"]`, `["update"]`)
- [ ] Support omitting from multiple schema types at once

#### Refinement & Transformation
- [ ] Add `@prisma-arktype.refine()` annotation for custom refinement logic
- [ ] Add `@prisma-arktype.transform()` annotation for data transformation
- [ ] Support passing custom error messages to refine
- [ ] Document refine and transform patterns

### Documentation Preservation
- [ ] Preserve Prisma schema model documentation in generated schemas
- [ ] Preserve Prisma schema field documentation in generated schemas
- [ ] Add JSDoc comments to generated types
- [ ] Include field descriptions from Prisma schema (excluding annotations)

### Better Type Mapping

#### Decimal Handling
- [ ] Support Decimal.js when `useDecimalJs` is enabled
- [ ] Generate proper ArkType schema for Decimal.js
- [ ] Add tests for Decimal type validation
- [ ] Document Decimal handling options

#### JSON Field Handling
- [ ] Improve JSON type generation with configurable nullability
- [ ] Add option for strict JSON schema validation
- [ ] Support typed JSON fields (using Prisma's typed JSON feature if available)

#### Bytes/Buffer Validation
- [ ] Enhance Buffer type validation
- [ ] Add size constraints for Bytes fields
- [ ] Add custom validators for Bytes type

#### Composite Types
- [ ] Add support for Prisma composite types
- [ ] Generate nested ArkType schemas for composite types
- [ ] Support annotations on composite type fields

### Additional Schema Types

#### Upsert Schemas
- [ ] Generate `ModelUpsert` schema for upsert operations
- [ ] Include create and update fields
- [ ] Add tests for upsert validation

#### Delete Schemas
- [ ] Generate `ModelDelete` schema for delete operations
- [ ] Support soft delete patterns

#### Aggregate Schemas
- [ ] Generate `ModelAggregate` schema for aggregate queries
- [ ] Support count, avg, sum, min, max operations
- [ ] Add proper typing for aggregate results

#### GroupBy Schemas
- [ ] Generate `ModelGroupBy` schema for groupBy queries
- [ ] Support having clause validation
- [ ] Add proper typing for grouped results

#### Count Schemas
- [ ] Generate `ModelCount` schema for count queries
- [ ] Support count with filters

#### Distinct Schemas
- [ ] Generate `ModelDistinct` schema for distinct queries

### Nested Write Validation
- [ ] Add validation for nested `create` operations
- [ ] Add validation for nested `update` operations
- [ ] Add validation for nested `connect` operations
- [ ] Add validation for nested `connectOrCreate` operations
- [ ] Add validation for nested `upsert` operations
- [ ] Add validation for nested `delete` operations
- [ ] Add validation for nested `set` operations

### Input/Result Type Separation
- [ ] Generate separate schemas for input types vs result types
- [ ] Add `ModelInput` and `ModelResult` schema variants
- [ ] Document when to use input vs result schemas

---

## 🟢 Low Priority (Nice to Have)

### File Organization Control

#### Custom File Structure
- [ ] Add option to generate one schema per file vs single file
- [ ] Add option for custom directory structure
- [ ] Support organizing by schema type (models, inputs, etc.)
- [ ] Add `fileStructure` configuration option

#### Index File Generation
- [ ] Auto-generate index files for easier imports
- [ ] Support barrel exports
- [ ] Add option to disable index generation

#### Custom Naming Patterns
- [ ] Support custom naming templates beyond simple suffix
- [ ] Add prefix option for generated schemas
- [ ] Support custom naming functions via config

### Better Error Messages
- [ ] Improve validation error messages with context
- [ ] Add helpful error messages for common misconfigurations
- [ ] Provide suggestions for fixing annotation syntax errors
- [ ] Add warnings for potentially problematic patterns

### Build & Performance
- [ ] Ensure generated code is tree-shakeable
- [ ] Optimize generation performance for large schemas
- [ ] Add option for incremental generation
- [ ] Add caching for unchanged models

### TypeScript Integration
- [ ] Ensure full compatibility with TypeScript strict mode
- [ ] Generate proper type definitions
- [ ] Add type-only exports where appropriate
- [ ] Test with various TypeScript versions

### Testing & Quality
- [ ] Add comprehensive test coverage for all validators
- [ ] Add integration tests with real Prisma schemas
- [ ] Add performance benchmarks
- [ ] Add tests for error cases

### Documentation
- [ ] Create comprehensive usage guide
- [ ] Add examples for all annotation types
- [ ] Document migration from prisma-zod-generator
- [ ] Add troubleshooting guide
- [ ] Create video tutorials or interactive examples

---

## 🔵 Advanced Features (Future Roadmap)

These are premium features in prisma-zod-generator that could be considered for future development:

### Security & Governance
- [ ] **Policies & Redaction** - Role-based access policies and PII masking
- [ ] **Drift Guard** - Breaking change detection with CI integration
- [ ] **PostgreSQL RLS** - Row-level security schema generation

### Integration Packs
- [ ] **Server Actions Pack** - Next.js typed server actions integration
- [ ] **Form UX Pack** - React Hook Form and UI library bindings (Shadcn/ui, Mantine, etc.)
- [ ] **API Docs Pack** - OpenAPI v3 and Swagger UI generation from schemas

### Developer Tools
- [ ] **Data Factories** - Test data generation utilities
- [ ] **SDK Publisher** - Generate typed client SDKs from schemas
- [ ] **Mock Data Generator** - Generate mock data matching schema constraints

### Enterprise Features
- [ ] **Multi-Tenant Kit** - Tenant isolation and context management
- [ ] **Performance Pack** - Streaming validation and chunked processing
- [ ] **Audit Logging** - Track schema changes and validation events

---

## Contributing

Want to help? Pick a task from the High Priority section and:

1. Create an issue discussing the implementation approach
2. Fork the repository
3. Create a feature branch
4. Implement the feature with tests
5. Create a changeset with `pnpm changeset`
6. Submit a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## Notes

- This roadmap is based on feature parity analysis with [prisma-zod-generator](https://github.com/omar-dulaimi/prisma-zod-generator) v1.31.1
- Priorities may shift based on community feedback and usage patterns
- Some features may be intentionally excluded if they don't fit ArkType's philosophy
- Premium features from prisma-zod-generator are listed for reference but may remain out of scope
