/**
 * Annotation Extraction Benchmarks
 * Tests performance of annotation parsing with different densities
 */

import { bench, describe } from "vitest";
import { extractAnnotations } from "../../src/annotations";

const noAnnotations = `
This is a simple description without any annotations.
Just regular documentation text.
`;

const singleAnnotation = `
This field is hidden from generation.
@prisma-arktype.hide
`;

const typeOverwrite = `
This field has a custom type.
@prisma-arktype.typeOverwrite="string.email"
Some more description text.
`;

const externalSchema = `
This field uses an external schema.
@prisma-arktype.schema="../../../schemas:AddressSchema"
Description continues here.
`;

const inlineSchema = `
This field has an inline schema.
@prisma-arktype.schema="{ name: 'string', age: 'number.integer' }"
More documentation.
`;

const multipleAnnotations = `
This field has multiple annotations for testing.
@prisma-arktype.hide
@prisma-arktype.typeOverwrite="string.url"
@prisma-arktype.input.hide
Complex field with lots of configuration.
Should still extract all annotations correctly.
`;

const heavyDocumentation = `
This is a very detailed field description.
It has lots of lines of documentation.

@prisma-arktype.typeOverwrite="string.email"

Here's some more explanation about what this field does.
It's used for user authentication and verification.

Technical details:
- Must be unique
- Must be validated
- Must be lowercase

@prisma-arktype.input.hide

And even more documentation after the annotations.
This tests the performance of mixed content.
`;

describe("Annotation Extraction - Single Patterns", () => {
  bench(
    "No annotations",
    () => {
      extractAnnotations(noAnnotations);
    },
    { iterations: 10000 },
  );

  bench(
    "Single @hide annotation",
    () => {
      extractAnnotations(singleAnnotation);
    },
    { iterations: 10000 },
  );

  bench(
    "Type overwrite annotation",
    () => {
      extractAnnotations(typeOverwrite);
    },
    { iterations: 10000 },
  );

  bench(
    "External schema annotation",
    () => {
      extractAnnotations(externalSchema);
    },
    { iterations: 10000 },
  );

  bench(
    "Inline schema annotation",
    () => {
      extractAnnotations(inlineSchema);
    },
    { iterations: 10000 },
  );

  bench(
    "Multiple annotations",
    () => {
      extractAnnotations(multipleAnnotations);
    },
    { iterations: 10000 },
  );

  bench(
    "Heavy documentation with annotations",
    () => {
      extractAnnotations(heavyDocumentation);
    },
    { iterations: 10000 },
  );
});

describe("Annotation Extraction - Bulk Processing", () => {
  bench(
    "100 fields without annotations",
    () => {
      for (let i = 0; i < 100; i++) {
        extractAnnotations(noAnnotations);
      }
    },
    { iterations: 100 },
  );

  bench(
    "100 fields with single annotation",
    () => {
      for (let i = 0; i < 100; i++) {
        extractAnnotations(singleAnnotation);
      }
    },
    { iterations: 100 },
  );

  bench(
    "100 fields with type overwrite",
    () => {
      for (let i = 0; i < 100; i++) {
        extractAnnotations(typeOverwrite);
      }
    },
    { iterations: 100 },
  );

  bench(
    "100 fields with multiple annotations",
    () => {
      for (let i = 0; i < 100; i++) {
        extractAnnotations(multipleAnnotations);
      }
    },
    { iterations: 100 },
  );
});

describe("Annotation Extraction - Realistic Workloads", () => {
  bench(
    "Mixed annotation density (10% annotated)",
    () => {
      // Simulate a realistic schema: 90 plain fields, 10 annotated
      for (let i = 0; i < 90; i++) {
        extractAnnotations(noAnnotations);
      }
      for (let i = 0; i < 10; i++) {
        extractAnnotations(typeOverwrite);
      }
    },
    { iterations: 50 },
  );

  bench(
    "Mixed annotation density (25% annotated)",
    () => {
      // Simulate: 75 plain fields, 25 annotated
      for (let i = 0; i < 75; i++) {
        extractAnnotations(noAnnotations);
      }
      for (let i = 0; i < 15; i++) {
        extractAnnotations(typeOverwrite);
      }
      for (let i = 0; i < 10; i++) {
        extractAnnotations(multipleAnnotations);
      }
    },
    { iterations: 50 },
  );

  bench(
    "Mixed annotation density (50% annotated)",
    () => {
      // Simulate: 50 plain fields, 50 annotated
      for (let i = 0; i < 50; i++) {
        extractAnnotations(noAnnotations);
      }
      for (let i = 0; i < 30; i++) {
        extractAnnotations(typeOverwrite);
      }
      for (let i = 0; i < 20; i++) {
        extractAnnotations(multipleAnnotations);
      }
    },
    { iterations: 50 },
  );
});

describe("Annotation Regex Performance", () => {
  const longSchemaValue = `{
    user: { name: 'string', email: 'string.email', age: 'number.integer' },
    address: { street: 'string', city: 'string', zip: 'string' },
    preferences: { theme: 'string', language: 'string' }
  }`;

  const complexSchema = `
  Complex field with nested schema.
  @prisma-arktype.schema="${longSchemaValue}"
  This tests regex performance on large values.
  `;

  bench(
    "Simple schema regex",
    () => {
      extractAnnotations(inlineSchema);
    },
    { iterations: 10000 },
  );

  bench(
    "Complex schema regex",
    () => {
      extractAnnotations(complexSchema);
    },
    { iterations: 10000 },
  );

  bench(
    "External schema path parsing",
    () => {
      extractAnnotations(externalSchema);
    },
    { iterations: 10000 },
  );
});

describe("Annotation Caching Opportunity", () => {
  // This benchmark demonstrates the opportunity for caching
  // In real usage, the same documentation is extracted multiple times
  const documentation = typeOverwrite;

  bench(
    "Extract same documentation 1000 times (no cache)",
    () => {
      for (let i = 0; i < 1000; i++) {
        extractAnnotations(documentation);
      }
    },
    { iterations: 10 },
  );

  bench(
    "Extract same documentation 1000 times (with cache simulation)",
    () => {
      // Simulate a cache by extracting once
      const cached = extractAnnotations(documentation);
      // Then just accessing the cached result
      for (let i = 0; i < 1000; i++) {
        const _ = { ...cached };
      }
    },
    { iterations: 10 },
  );
});
