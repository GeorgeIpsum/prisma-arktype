# prismark

## 2.0.0

### Major Changes

- c4789cd: Initial release of prismark - Generate ArkType schemas from your Prisma schema.

  Features:

  - Generate plain ArkType schemas from Prisma models
  - Generate create/update input schemas
  - Generate where clause schemas
  - Generate select, include, and orderBy schemas
  - Support for Prisma relations
  - Support for Prisma enums
  - Annotation support for fine-grained control:
    - @prismark.hide - Hide models or fields from generation
    - @prismark.input.hide - Hide fields from input schemas
    - @prismark.create.input.hide - Hide fields from create schemas
    - @prismark.update.input.hide - Hide fields from update schemas
    - @prismark.typeOverwrite - Override generated types
