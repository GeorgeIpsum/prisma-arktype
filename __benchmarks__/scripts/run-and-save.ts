#!/usr/bin/env tsx
/**
 * Run benchmarks and save results to JSON
 * This script runs benchmarks and captures results since Vitest v4 doesn't
 * support JSON reporter for benchmarks directly.
 */

import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const REPORTS_DIR = "__benchmarks__/reports";
const OUTPUT_FILE = `${REPORTS_DIR}/latest.json`;

// Ensure reports directory exists
mkdirSync(REPORTS_DIR, { recursive: true });

console.log("Running benchmarks...\n");

try {
  // Run benchmarks and capture output
  const output = execSync(
    "pnpm vitest bench --run --config vitest.bench.config.ts",
    {
      encoding: "utf-8",
      stdio: ["inherit", "pipe", "pipe"],
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    },
  );

  // Create a simple JSON structure with timestamp and output
  const result = {
    timestamp: new Date().toISOString(),
    git: {
      branch: execSync("git rev-parse --abbrev-ref HEAD", {
        encoding: "utf-8",
      }).trim(),
      commit: execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim(),
      shortCommit: execSync("git rev-parse --short HEAD", {
        encoding: "utf-8",
      }).trim(),
    },
    output: output,
    status: "success",
  };

  // Save to file
  writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
  console.log(`\n✅ Results saved to ${OUTPUT_FILE}`);

  // Also print the output
  console.log(output);
  // biome-ignore lint/suspicious/noExplicitAny: <nah>
} catch (error: any) {
  // Even if benchmarks fail, save the error
  const result = {
    timestamp: new Date().toISOString(),
    git: {
      branch: execSync("git rev-parse --abbrev-ref HEAD", {
        encoding: "utf-8",
      }).trim(),
      commit: execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim(),
      shortCommit: execSync("git rev-parse --short HEAD", {
        encoding: "utf-8",
      }).trim(),
    },
    output: error.stdout?.toString() || "",
    error: error.stderr?.toString() || error.message,
    status: "failed",
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
  console.error(`\n❌ Benchmarks failed. Results saved to ${OUTPUT_FILE}`);
  console.error(error.stderr?.toString() || error.message);
  process.exit(1);
}
