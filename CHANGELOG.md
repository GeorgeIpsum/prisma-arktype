# prisma-arktype

## 2.5.1

### Patch Changes

- fbd84b3: Update export path maps to include default exports for tsx resolution

## 2.5.0

### Minor Changes

- b0fd74f: ✨ Features

  - Added date fields support for where schemas
  - Improved Prisma bytes field handling - now generates as either Uint8Array or Buffer type in schema based on context
  - Added database array type filters support
  - Added comprehensive scalar filters for better query capabilities

  🐛 Fixes

  - Fixed bytes fields being returned as type unknown
  - Fixed benchmark scripting issues

  ⚡ Performance

  - Set up comprehensive benchmarking infrastructure with:
    - Multiple test fixtures (small, medium, large, extreme schemas)
    - Realistic scenarios (e-commerce, SaaS, social media schemas)
    - Benchmark suites for annotations and generation
    - Automated baseline tracking and comparison tools
    - GitHub Actions workflow for CI benchmarks

  🔧 Refactoring

  - Refactored runtime schema dependencies for better modularity
  - Cached isPrismaV7OrHigher result to avoid repeated file I/O operations
  - Removed unused code

  🏗️ Infrastructure

  - Added benchmark GitHub Actions workflow with DATABASE_URL configuration
  - Updated benchmark workflow configuration
  - Added comprehensive benchmark documentation and tooling

## 2.4.0

### Minor Changes

- 6086baf: allow custom json schema injection for generated schemas

## 2.3.0

### Minor Changes

- cbb297c: add relation links automatically in generated schemas

## 2.2.0

### Minor Changes

- d3305be: use generated enum schemas in resulting model schemas

## 2.1.0

### Minor Changes

- 9df3e84: Fix schema generation for more complex relations

## 2.0.0

### Major Changes

- c4789cd: Initial release of prisma-arktype - Generate ArkType schemas from your Prisma schema.

  Features:

  - Generate plain ArkType schemas from Prisma models
  - Generate create/update input schemas
  - Generate where clause schemas
  - Generate select, include, and orderBy schemas
  - Support for Prisma relations
  - Support for Prisma enums
  - Annotation support for fine-grained control:
    - @prisma-arktype.hide - Hide models or fields from generation
    - @prisma-arktype.input.hide - Hide fields from input schemas
    - @prisma-arktype.create.input.hide - Hide fields from create schemas
    - @prisma-arktype.update.input.hide - Hide fields from update schemas
    - @prisma-arktype.typeOverwrite - Override generated types
