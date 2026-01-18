/**
 * Generate an extreme test schema with 500 models and ~4000 fields
 * for scalability testing
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MODEL_COUNT = 500;
const _AVG_FIELDS_PER_MODEL = 8;

function generateExtremeSchema(): string {
  const lines: string[] = [];

  lines.push("// Extreme Schema - Scalability Limits Testing");
  lines.push("// 500 models, 50 enums, ~4000 fields");
  lines.push("// Target: <30s generation time");
  lines.push("// Output: ~4000 files, ~15 MB");
  lines.push("");
  lines.push("datasource db {");
  lines.push('  provider = "postgresql"');
  lines.push("}");
  lines.push("");
  lines.push("generator client {");
  lines.push('  provider = "prisma-client-js"');
  lines.push("}");
  lines.push("");
  lines.push("generator prisma_arktype {");
  lines.push('  provider = "node ../../dist/index.js"');
  lines.push('  output   = "../../__benchmarks__/reports/.generated/extreme"');
  lines.push("}");
  lines.push("");

  // Generate 50 enums
  lines.push("// Enums (50 total)");
  for (let i = 0; i < 50; i++) {
    const values = Array.from({ length: 5 }, (_, j) => `VALUE_${i}_${j}`).join(
      " ",
    );
    lines.push(`enum Enum${i} { ${values} }`);
  }
  lines.push("");

  // Generate models in groups
  const modelsPerGroup = 50;
  const groupCount = MODEL_COUNT / modelsPerGroup;

  for (let group = 0; group < groupCount; group++) {
    lines.push(
      `// Model Group ${group + 1} (Models ${group * modelsPerGroup + 1}-${(group + 1) * modelsPerGroup})`,
    );

    for (let i = 0; i < modelsPerGroup; i++) {
      const modelIndex = group * modelsPerGroup + i;
      const modelName = `Model${modelIndex}`;

      lines.push(`model ${modelName} {`);
      lines.push("  id String @id @default(cuid())");

      // Add various field types
      lines.push("  name String");
      lines.push("  description String?");
      lines.push("  value Int @default(0)");
      lines.push("  amount Decimal @db.Decimal(10, 2)");
      lines.push("  isActive Boolean @default(true)");
      lines.push("  metadata Json?");
      lines.push("  createdAt DateTime @default(now())");
      lines.push("  updatedAt DateTime @updatedAt");

      // Add enum field occasionally
      if (modelIndex % 10 === 0) {
        const enumIndex = modelIndex % 50;
        lines.push(`  status Enum${enumIndex} @default(VALUE_${enumIndex}_0)`);
      }

      // Add relation to previous model
      if (modelIndex > 0) {
        const relatedModelIndex = modelIndex - 1;
        const _relatedModel = `Model${relatedModelIndex}`;
        lines.push("  relatedId String?");
        lines.push("  @@index([relatedId])");
      }

      lines.push("}");
      lines.push("");
    }
  }

  return lines.join("\n");
}

const schema = generateExtremeSchema();
const outputPath = join(__dirname, "../fixtures/extreme.prisma");
writeFileSync(outputPath, schema, "utf-8");

console.log(
  `Generated extreme schema with ${MODEL_COUNT} models at: ${outputPath}`,
);
