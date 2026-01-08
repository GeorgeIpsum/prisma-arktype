# Prisma Schema Files

This directory contains the Prisma schema for the project, split across multiple files.

## Schema Organization

### Production Schemas (Gitignored)
Production schemas are environment-specific and are not committed to version control:
- `schema.prisma` - Main configuration (datasource, generators)
- `user.prisma` - User and UserProfile models
- `tenant.prisma` - Tenant models
- `payment.prisma` - Payment models
- `invoice.prisma` - Invoice models
- `service-account.prisma` - ServiceAccount models
- `payment-method.prisma` - PaymentMethod models
- `payment-gateway.prisma` - PaymentGateway models
- `auto-pay-enrollment.prisma` - AutoPayEnrollment models
- `plugin.prisma` - Plugin models
- `geo.prisma` - Geographic models (Address, Country)
- `locale.prisma` - Locale and CountryLocale models

### Test Schema (Version Controlled)
- **`test-models.prisma`** - Complete test schema for the generator test suite

## Test Models

The `test-models.prisma` file is a **completely self-contained schema** designed exclusively for testing the prisma-arktype generator. It includes:

### Test Model Categories:

1. **Basic Models** - `TestUser`, `TestPost`, `TestProfile`
   - Testing: plain schemas, create/update inputs, where clauses
   - Features: required/optional fields, unique constraints, timestamps, defaults

2. **Relation Models** - `TestMetadata`, `TestTag`, `TestComment`
   - Testing: one-to-one, one-to-many, many-to-many relations
   - Features: composite keys, nested relations

3. **Type Testing Models** - `TestAllTypes`, `TestEnumModel`
   - Testing: all Prisma scalar types (String, Int, BigInt, Float, Decimal, Boolean, DateTime, Json, Bytes)
   - Features: optional types, defaults, enum fields

4. **Annotation Models** - `HiddenModel`, `AnnotatedModel`, `TestOptionsModel`
   - Testing: `@prisma-arktype.hide`, `@prisma-arktype.input.hide`, `@prisma-arktype.typeOverwrite`, custom options
   - Features: field-level and model-level annotations

5. **Query Models** - `TestQueryModel`, `TestQueryItem`
   - Testing: Select, Include, OrderBy schema generation

6. **Organization Models** - `TestOrganization`, `TestMember`, `TestProject`
   - Testing: relation create/update operations

### Key Features:
- ✅ **Schema Independent** - Tests run without any production schema
- ✅ **Comprehensive Coverage** - Tests all generator features
- ✅ **Self-Contained** - No dependencies on external schemas
- ✅ **Version Controlled** - Committed to the repository
- ✅ **Portable** - Can be used across different projects

### Test Enums:
- `TestCurrency` - USD, CAD, EUR, GBP, JPY, AUD, CNY
- `TestStatus` - ACTIVE, INACTIVE, PENDING

*Note: Test enums are prefixed with `Test` to avoid conflicts with production schemas.*

## Generating Types

```bash
prisma generate
```

This generates:
- Prisma Client in `/prisma/generated/client`
- ArkType validators in `/prisma/generated/validators`

The generator processes both production AND test schemas together.

## For Contributors

When adding new generator features:

1. **Add test models to `test-models.prisma`** - Create models that exercise your new feature
2. **Update `__tests__/config/model-mapping.ts`** - Add mappings for your new test scenarios
3. **Write tests** - Use the test helpers to validate your feature works correctly

See existing models and tests for examples.
