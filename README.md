# prisma-arktype

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
npm install prisma-arktype arktype
# or
pnpm add prisma-arktype arktype
# or
yarn add prisma-arktype arktype
```

## Usage

### Basic Setup

Add the generator to your `schema.prisma` file:

```prisma
generator prisma-arktype {
  provider = "prisma-arktype"
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
generator prisma-arktype {
  provider                     = "prisma-arktype"
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

- **`ModelPlain`** - Scalar fields only (strings, numbers, dates, enums) - no relations
- **`ModelRelations`** - Relationship fields only, referencing related model Plain types
- **`Model`** - Complete composite schema combining Plain & Relations
- **`ModelWhere`** - Where clause schema for filtering
- **`ModelWhereUnique`** - Unique where clause schema for finding specific records
- **`ModelCreate`** - Input schema for creating records
- **`ModelUpdate`** - Input schema for updating records
- **`ModelSelect`** - Schema for selecting specific fields
- **`ModelInclude`** - Schema for including relations
- **`ModelOrderBy`** - Schema for ordering results

**Enums** are generated as separate reusable types that are imported and referenced by models that use them.

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

### Generated Code Examples

#### Enum Generation

For a Prisma enum like:
```prisma
enum Currency {
  USD
  EUR
  GBP
}
```

The generator creates a separate reusable type:
```typescript
// Currency.ts
import { type } from "arktype";

export const Currency = type("'USD' | 'EUR' | 'GBP'");
```

Which is then imported and used in models:
```typescript
// PaymentPlain.ts
import { type } from "arktype";
import { Currency } from "./Currency";

export const PaymentPlain = type({
  "id": "string",
  "amount": "number",
  "currency": Currency,        // Required enum
  "status?": Currency.or("null") // Optional enum
});
```

#### Relation Generation

For Prisma models with relations like:
```prisma
model User {
  id    String  @id
  email String
  posts Post[]
}

model Post {
  id       String @id
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId String
}
```

The generator creates Plain types (without relations):
```typescript
// UserPlain.ts
export const UserPlain = type({
  "id": "string",
  "email": "string"
});

// PostPlain.ts
export const PostPlain = type({
  "id": "string",
  "title": "string",
  "authorId": "string"
});
```

And Relations types that reference the Plain types:
```typescript
// UserRelations.ts
import { PostPlain } from "./PostPlain";

export const UserRelations = type({
  "posts": PostPlain.array() // Array of Post objects
});

// PostRelations.ts
import { UserPlain } from "./UserPlain";

export const PostRelations = type({
  "author": UserPlain // Single User object
});
```

The combined model merges both:
```typescript
// User.ts
import { UserPlain } from "./UserPlain";
import { UserRelations } from "./UserRelations";

export const User = type(() => UserPlain.and(UserRelations));
```

## Annotations

Control schema generation using annotations in your Prisma schema. All annotations are added as documentation comments (`///`).

### Available Annotations

| Annotation | Scope | Description |
|------------|-------|-------------|
| `@prisma-arktype.hide` | Model or Field | Completely hide from all generated schemas |
| `@prisma-arktype.input.hide` | Field | Hide from Create and Update input schemas |
| `@prisma-arktype.create.input.hide` | Field | Hide from Create input schema only |
| `@prisma-arktype.update.input.hide` | Field | Hide from Update input schema only |
| `@prisma-arktype.typeOverwrite="<type>"` | Field | Override the generated ArkType type |

### Hide Fields/Models

Completely exclude models or fields from all generated schemas:

```prisma
/// @prisma-arktype.hide
model InternalModel {
  id String @id
  secret String
}

model User {
  id String @id
  email String
  /// @prisma-arktype.hide
  passwordHash String
}
```

### Hide from Input Models

Control which fields appear in Create and Update schemas:

```prisma
model User {
  id String @id
  email String

  /// @prisma-arktype.input.hide
  /// Hidden from both Create and Update
  computedField String

  /// @prisma-arktype.create.input.hide
  /// Only appears in Update schema
  lastModified DateTime

  /// @prisma-arktype.update.input.hide
  /// Only appears in Create schema
  initialStatus String
}
```

### Type Override

Override the default type mapping with custom ArkType type strings:

```prisma
model User {
  id String @id
  /// @prisma-arktype.typeOverwrite="string.email"
  email String
  /// @prisma-arktype.typeOverwrite="string.url"
  website String
  /// @prisma-arktype.typeOverwrite="string.numeric"
  phone String
}
```

This allows you to use any ArkType type definition, including built-in refinements like `string.email`, `string.url`, `number.integer`, etc.

## Type Mapping

Prisma types are mapped to ArkType as follows:

| Prisma Type | ArkType Type | Example Output |
|-------------|--------------|----------------|
| `String` | `"string"` | `"string"` |
| `Int` | `"number.integer"` | `"number.integer"` |
| `BigInt` | `"number.integer"` | `"number.integer"` |
| `Float` | `"number"` | `"number"` |
| `Decimal` | `"number"` | `"number"` |
| `Boolean` | `"boolean"` | `"boolean"` |
| `DateTime` | `"Date"` | `"Date"` |
| `Json` | `"unknown"` | `"unknown"` |
| `Bytes` | `"instanceof Buffer"` | `"instanceof Buffer"` |
| Enums | Reference to enum type | `Currency` (imported from `./Currency`) |
| Relations | Reference to related Plain type | `PostPlain` or `PostPlain.array()` |

### Special Handling

- **Optional fields**: Use `?` on the key name (`"name?": "string"`)
- **Nullable fields**: Add `| null` to the type (`"string | null"`)
- **Arrays**: Use `.array()` syntax for lists (`type("string").array()` or `Currency.array()`)
- **Enums**: Generated as separate reusable type definitions and imported where used
- **Relations**: Reference the Plain type of the related model, imported automatically

## Differences from prismabox

While this package is inspired by prismabox, there are some key differences:

1. **ArkType vs TypeBox**: Uses ArkType's syntax and type system instead of TypeBox
2. **Simpler type definitions**: ArkType's string-based syntax makes schemas more readable
3. **No nullable wrapper**: ArkType handles nullable types directly with union syntax
4. **Different validation API**: Uses ArkType's validation approach

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/prisma-arktype.git
cd prisma-arktype

# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run linter
pnpm lint

# Fix linting issues
pnpm lint:fix
```

### Testing

This library has a **completely schema-independent test suite** using self-contained test models in `prisma/schema/test-models.prisma`.

#### Running Tests

```bash
# Run all tests
pnpm test:e2e

# Run tests in watch mode
pnpm test:watch
```

#### Test Architecture

The test suite is designed to be **100% independent** of production schemas:

- **Self-Contained Schema** - `prisma/schema/test-models.prisma` contains all models needed for testing
- **No Production Dependencies** - Tests work even if production schemas don't exist
- **Comprehensive Coverage** - Test models cover all Prisma types, relations, and generator features
- **Portable** - Can be used across different projects or extracted as a standalone test suite

#### Test Model Categories

The test schema includes specialized models for testing:

1. **Basic CRUD** - `TestUser`, `TestPost`, `TestProfile`
2. **All Prisma Types** - `TestAllTypes` (String, Int, BigInt, Float, Decimal, Boolean, DateTime, Json, Bytes)
3. **Relations** - One-to-one, one-to-many, many-to-many, composite keys
4. **Annotations** - `@prisma-arktype.hide`, `@prisma-arktype.input.hide`, `@prisma-arktype.typeOverwrite`
5. **Query Operations** - Select, Include, OrderBy schemas
6. **Enums** - `TestCurrency`, `TestStatus`

#### Adding New Tests

1. **Add test models** to `prisma/schema/test-models.prisma` if needed
2. **Update mapping** in `__tests__/config/model-mapping.ts` to reference your models
3. **Write tests** using helper functions from `__tests__/utils/test-helpers.ts`
4. **Run tests** - `pnpm test`

See existing test files for examples.

#### Why Schema-Independent?

- ✅ Tests never break due to production schema changes
- ✅ Contributors can run tests without setting up production databases
- ✅ Tests can be run in isolation (CI/CD, local development)
- ✅ Clear, documented examples of generator usage
- ✅ Easy to test new features by adding new test models

### Publishing

This project uses [Changesets](https://github.com/changesets/changesets) for version management and publishing.

#### Creating a changeset

When you make changes that should be included in the next release:

```bash
pnpm changeset
```

This will prompt you to:
1. Select the type of change (major, minor, patch)
2. Provide a description of the changes

Commit the generated changeset file along with your changes.

#### Publishing workflow

1. **Create a changeset** for your changes
2. **Open a PR** with your changes and the changeset
3. **Merge the PR** - The GitHub Action will automatically create a "Version Packages" PR
4. **Review and merge** the Version Packages PR - This will:
   - Update the version in package.json
   - Update the CHANGELOG.md
   - Publish the package to npm
   - Create a GitHub release

#### Manual publishing (maintainers only)

```bash
# Build and publish
pnpm release
```

**Prerequisites:**
- Set up `NPM_TOKEN` secret in GitHub repository settings
- Ensure you have publish access to the npm package

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Create a changeset (`pnpm changeset`)
5. Commit your changes following the commit message format (see below)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Commit messages are automatically linted using commitlint and lefthook.

Format: `<type>(<scope>): <subject>`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes

**Examples:**
```bash
git commit -m "feat: add support for custom type validators"
git commit -m "fix: resolve issue with nullable DateTime fields"
git commit -m "docs: update installation instructions"
git commit -m "refactor: simplify where clause generation"
```

### Git Hooks

This project uses [lefthook](https://github.com/evilmartians/lefthook) to manage git hooks:

- **commit-msg**: Validates commit message format
- **pre-commit**: Runs linter and checks for debug statements
- **pre-push**: Runs tests before pushing

To skip hooks (use sparingly):
```bash
git commit --no-verify -m "your message"
```

## License

MIT

## Credits

This package is heavily based on [prismabox](https://github.com/m1212e/prismabox) by m1212e. Many thanks for the excellent foundation and architecture!

## Related Projects

- [ArkType](https://arktype.io) - TypeScript's 1:1 validator
- [Prisma](https://www.prisma.io) - Next-generation ORM for Node.js & TypeScript
- [prismabox](https://github.com/m1212e/prismabox) - Generate TypeBox schemas from Prisma (inspiration for this project)
