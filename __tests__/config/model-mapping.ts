/**
 * Maps test scenarios to test schema models
 *
 * IMPORTANT: This configuration uses ONLY test models (Test* prefix) from
 * prisma/schema/test-models.prisma, making the test suite completely
 * independent of any production schema.
 *
 * The test schema is self-contained and covers all generator features:
 * - All Prisma field types
 * - Relations (one-to-one, one-to-many, many-to-many)
 * - Composite keys
 * - Unique constraints
 * - Annotations
 * - Enums
 * - JSON fields
 * - Timestamps and defaults
 */

export const TEST_MODEL_MAP = {
  // Plain model with various field types
  BASIC_MODEL: "TestUser",

  // Model with relations (one-to-many)
  MODEL_WITH_RELATIONS: "TestUser",
  RELATED_MODEL: "TestPost",

  // One-to-one relation
  ONE_TO_ONE_PARENT: "TestUser",
  ONE_TO_ONE_CHILD: "TestProfile",

  // Model with unique fields
  MODEL_WITH_UNIQUE: "TestUser",
  UNIQUE_FIELD: "email",

  // Model with composite keys
  COMPOSITE_KEY_MODEL: "TestCompositeKey",

  // Model with auto-generated timestamps
  MODEL_WITH_TIMESTAMPS: "TestUser",

  // Model with Json field
  MODEL_WITH_JSON: "TestJsonModel",
  JSON_FIELD: "metadata",

  // Enum for testing
  BASIC_ENUM: "TestCurrency",
  ENUM_VALUES: ["USD", "CAD", "EUR", "GBP", "JPY", "AUD", "CNY"] as const,

  STATUS_ENUM: "TestStatus",
  STATUS_VALUES: ["ACTIVE", "INACTIVE", "PENDING"] as const,

  // Annotation models (from test-models.prisma)
  HIDDEN_MODEL: "HiddenModel",
  ANNOTATED_MODEL: "AnnotatedModel",

  // Schema annotation model
  SCHEMA_ANNOTATION_MODEL: "TestSchemaAnnotation",

  // All types model (for comprehensive type testing)
  ALL_TYPES: "TestAllTypes",
} as const;

/**
 * Sample valid data for each test model
 * Used to construct test fixtures
 *
 * These fixtures match the test models defined in prisma/schema/test-models.prisma
 */
export const TEST_FIXTURES = {
  TestUser: {
    id: "user_test123",
    email: "test@example.com",
    name: "Test User",
    phoneNumber: "+1234567890",
    isActive: true,
  },

  TestProfile: {
    id: "profile_test123",
    userId: "user_test123",
    bio: "Test bio",
    website: "https://example.com",
    avatarUrl: "https://example.com/avatar.jpg",
  },

  TestPost: {
    id: "post_test123",
    title: "Test Post",
    content: "Test content",
    published: false,
    views: 100,
    rating: 4.5,
    authorId: "user_test123",
  },

  TestMetadata: {
    userId: "user_test123",
    key: "test_key",
    value: "test_value",
  },

  TestCompositeKey: {
    tenantId: "tenant_test",
    userId: "user_test123",
    role: "admin",
    metadata: {},
  },

  TestJsonModel: {
    id: "json_test123",
    metadata: { key: "value" },
    settings: { theme: "dark" },
    data: { foo: "bar" },
  },

  AnnotatedModel: {
    id: "ann_test123",
    hiddenField: "hidden",
    computedField: "computed",
    updateOnlyField: "update_only",
    createOnlyField: "create_only",
    email: "test@example.com",
    website: "https://example.com",
    normalField: "normal",
    description: "Test description",
  },

  TestTag: {
    id: "tag_test123",
    name: "test-tag",
  },

  TestComment: {
    id: "comment_test123",
    content: "Test comment",
    postId: "post_test123",
  },

  TestAllTypes: {
    id: "types_test123",
    string: "test string",
    text: "test text",
    int: 42,
    bigInt: BigInt(9007199254740991),
    float: 3.14,
    decimal: 99.99,
    boolean: true,
    dateTime: new Date(),
    date: new Date(),
    time: new Date(),
    json: { test: "data" },
    bytes: Buffer.from("test"),
    stringOpt: "optional",
    intOpt: 10,
    booleanOpt: false,
    dateTimeOpt: new Date(),
    jsonOpt: { optional: true },
    stringDefault: "default",
    intDefault: 42,
    booleanDefault: true,
    dateTimeDefault: new Date(),
    jsonDefault: {},
  },

  TestEnumModel: {
    id: "enum_test123",
    currency: "USD" as const,
    status: "ACTIVE" as const,
    optionalCurrency: "EUR" as const,
    optionalStatus: "PENDING" as const,
  },

  TestUniqueModel: {
    id: "unique_test123",
    email: "unique@example.com",
    username: "uniqueuser",
    slug: "test-slug",
    category: "test-category",
  },

  TestQueryModel: {
    id: "query_test123",
    title: "Test Query",
    subtitle: "Subtitle",
    priority: 5,
    score: 8.5,
    isActive: true,
  },

  TestQueryItem: {
    id: "item_test123",
    name: "Test Item",
    value: "test value",
    modelId: "query_test123",
  },

  TestOrganization: {
    id: "org_test123",
    name: "Test Organization",
  },

  TestMember: {
    id: "member_test123",
    name: "Test Member",
    email: "member@example.com",
    organizationId: "org_test123",
  },

  TestProject: {
    id: "project_test123",
    name: "Test Project",
    description: "Test project description",
    organizationId: "org_test123",
  },

  TestSchemaAnnotation: {
    id: "schema_test123",
    inlineJson: { name: "John Doe", age: 30 },
    addressJson: {
      street: "123 Main St",
      city: "Boston",
      zipCode: "02101",
      country: "USA",
    },
    billingAddress: {
      street: "456 Billing Ave",
      city: "Cambridge",
      zipCode: "02139",
      country: "USA",
    },
    configJson: {
      theme: "dark" as const,
      language: "en",
    },
    emailWithSchema: "test@example.com",
    items: [
      { id: "item1", quantity: 5 },
      { id: "item2", quantity: 10 },
    ],
    metadata: { key: "testKey", value: "testValue" },
    age: 25,
    isActive: true,
    createdAt: new Date("2024-01-01T00:00:00Z"),
  },
} as const;
