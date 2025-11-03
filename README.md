# prismark

Generate [ArkType](https://arktype.io) validation schemas from your [Prisma](https://www.prisma.io) schema.

This package is heavily inspired by and based on the structure of [prismabox](https://github.com/m1212e/prismabox), which generates TypeBox schemas from Prisma schemas.

## Features

- 🎯 **Type-safe validation** - Generate ArkType schemas that match your Prisma models
- 🔄 **Automatic generation** - Schemas are generated automatically when you run `prisma generate`
- 📦 **Comprehensive coverage** - Generates schemas for models, relations, where clauses, select, include, orderBy, and more
- 🎨 **Customizable** - Control schema generation with annotations
- 🚀 **Zero config** - Works out of the box with sensible defaults

## Installation

```bash
npm install prismark arktype
# or
pnpm add prismark arktype
# or
yarn add prismark arktype
```

## Usage

### Basic Setup

Add the generator to your `schema.prisma` file:

```prisma
generator prismark {
  provider = "prismark"
  output   = "./generated/validators"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Then run:

```bash
npx prisma generate
```

### Configuration Options

Configure the generator in your `schema.prisma`:

```prisma
generator prismark {
  provider                     = "prismark"
  output                       = "./generated/validators"
  arktypeImportDependencyName  = "arktype"
  ignoredKeysOnInputModels     = ["id", "createdAt", "updatedAt"]
}
```

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `output` | `string` | `"./prisma/generated/validators"` | Output directory for generated schemas |
| `arktypeImportDependencyName` | `string` | `"arktype"` | The package name to import from |
| `ignoredKeysOnInputModels` | `string[]` | `["id", "createdAt", "updatedAt"]` | Fields to exclude from input models |

### Generated Schemas

For each model, the generator creates multiple schema types:

- **`ModelPlain`** - Fields without relationships
- **`ModelRelations`** - Relationship definitions only
- **`Model`** - Complete composite schema (Plain & Relations)
- **`ModelWhere`** - Where clause schema
- **`ModelWhereUnique`** - Unique where clause schema
- **`ModelCreate`** - Create input schema
- **`ModelUpdate`** - Update input schema
- **`ModelSelect`** - Select schema
- **`ModelInclude`** - Include schema
- **`ModelOrderBy`** - OrderBy schema

### Using Generated Schemas

```typescript
import { type } from "arktype";
import { User, UserCreate, UserWhere } from "./generated/validators";

// Validate a user object
const userResult = User(someUserData);
if (userResult instanceof type.errors) {
  console.error(userResult.summary);
} else {
  // userResult is validated user data
  console.log(userResult);
}

// Validate create input
const createData = {
  email: "user@example.com",
  name: "John Doe"
};

const createResult = UserCreate(createData);
// ...

// Validate where clauses
const whereClause = {
  email: "user@example.com"
};

const whereResult = UserWhere(whereClause);
// ...
```

## Annotations

Control schema generation using annotations in your Prisma schema:

### Hide Fields/Models

```prisma
/// @prismark.hide
model InternalModel {
  id String @id
}

model User {
  id String @id
  /// @prismark.hide
  internalField String
}
```

### Hide from Input Models

```prisma
model User {
  id String @id
  /// @prismark.input.hide
  computedField String
  /// @prismark.create.input.hide
  onlyInUpdates String
  /// @prismark.update.input.hide
  onlyInCreates String
}
```

### Type Override

```prisma
model User {
  id String @id
  /// @prismark.typeOverwrite="string.email"
  email String
  /// @prismark.typeOverwrite="string.numeric"
  phone String
}
```

### Custom Options

```prisma
model User {
  id String @id
  /// @prismark.options{minLength: 3, maxLength: 50}
  username String
}
```

## Type Mapping

Prisma types are mapped to ArkType as follows:

| Prisma Type | ArkType Type |
|-------------|--------------|
| `String` | `"string"` |
| `Int` | `"integer"` |
| `BigInt` | `"integer"` |
| `Float` | `"number"` |
| `Decimal` | `"number"` |
| `Boolean` | `"boolean"` |
| `DateTime` | `"Date"` |
| `Json` | `"unknown"` |
| `Bytes` | `"instanceof Buffer"` |
| Enums | Union of literal values |

## Differences from prismabox

While this package is inspired by prismabox, there are some key differences:

1. **ArkType vs TypeBox**: Uses ArkType's syntax and type system instead of TypeBox
2. **Simpler type definitions**: ArkType's string-based syntax makes schemas more readable
3. **No nullable wrapper**: ArkType handles nullable types directly with union syntax
4. **Different validation API**: Uses ArkType's validation approach

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Credits

This package is heavily based on [prismabox](https://github.com/m1212e/prismabox) by m1212e. Many thanks for the excellent foundation and architecture!

## Related Projects

- [ArkType](https://arktype.io) - TypeScript's 1:1 validator
- [Prisma](https://www.prisma.io) - Next-generation ORM for Node.js & TypeScript
- [prismabox](https://github.com/m1212e/prismabox) - Generate TypeBox schemas from Prisma (inspiration for this project)
