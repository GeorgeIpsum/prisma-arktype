/**
 * Baseline management for performance regression detection
 */

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { compareMetrics, formatComparison } from "./metrics";
import type { BenchmarkReport, MetricsComparison } from "./metrics";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASELINE_PATH = join(__dirname, "../reports/baseline.json");
const REPORTS_DIR = join(__dirname, "../reports");
const HISTORY_DIR = join(__dirname, "../reports/history");

/**
 * Ensure reports directory exists
 */
function ensureReportsDir(): void {
  if (!existsSync(REPORTS_DIR)) {
    mkdirSync(REPORTS_DIR, { recursive: true });
  }
  if (!existsSync(HISTORY_DIR)) {
    mkdirSync(HISTORY_DIR, { recursive: true });
  }
}

/**
 * Get current git commit hash
 */
function getCurrentCommit(): string {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim();
  } catch {
    return "unknown";
  }
}

/**
 * Get current git branch
 */
function getCurrentBranch(): string {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD", {
      encoding: "utf-8",
    }).trim();
  } catch {
    return "unknown";
  }
}

/**
 * Load baseline report
 */
export function loadBaseline(): BenchmarkReport | null {
  if (!existsSync(BASELINE_PATH)) {
    return null;
  }

  try {
    const content = readFileSync(BASELINE_PATH, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to load baseline:", error);
    return null;
  }
}

/**
 * Save baseline report
 */
export function saveBaseline(report: BenchmarkReport): void {
  ensureReportsDir();

  // Add git metadata
  const enrichedReport = {
    ...report,
    git: {
      commit: getCurrentCommit(),
      branch: getCurrentBranch(),
    },
  };

  writeFileSync(
    BASELINE_PATH,
    JSON.stringify(enrichedReport, null, 2),
    "utf-8",
  );
  console.log(`✅ Baseline saved to: ${BASELINE_PATH}`);
}

/**
 * Archive current report to history
 */
export function archiveReport(report: BenchmarkReport, suffix?: string): void {
  ensureReportsDir();

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = suffix
    ? `benchmark-${timestamp}-${suffix}.json`
    : `benchmark-${timestamp}.json`;

  const archivePath = join(HISTORY_DIR, filename);

  // Add git metadata
  const enrichedReport = {
    ...report,
    git: {
      commit: getCurrentCommit(),
      branch: getCurrentBranch(),
    },
  };

  writeFileSync(archivePath, JSON.stringify(enrichedReport, null, 2), "utf-8");
  console.log(`📦 Report archived to: ${archivePath}`);
}

/**
 * Compare current report with baseline
 */
export function compareWithBaseline(currentReport: BenchmarkReport): {
  comparisons: MetricsComparison[];
  summary: {
    total: number;
    regressions: number;
    warnings: number;
    improvements: number;
  };
} {
  const baseline = loadBaseline();

  if (!baseline) {
    console.log(
      "⚠️  No baseline found. Run with --update-baseline to create one.",
    );
    return {
      comparisons: [],
      summary: { total: 0, regressions: 0, warnings: 0, improvements: 0 },
    };
  }

  const comparisons: MetricsComparison[] = [];
  let regressions = 0;
  let warnings = 0;
  let improvements = 0;

  // Match benchmarks by name and schema
  for (const currentMetric of currentReport.benchmarks) {
    const baselineMetric = baseline.benchmarks.find(
      (b) => b.name === currentMetric.name && b.schema === currentMetric.schema,
    );

    if (!baselineMetric) {
      console.log(
        `⚠️  No baseline found for: ${currentMetric.name} (${currentMetric.schema})`,
      );
      continue;
    }

    const comparison = compareMetrics(currentMetric, baselineMetric);
    comparisons.push(comparison);

    if (comparison.regression === "critical") {
      regressions++;
    } else if (comparison.regression === "warning") {
      warnings++;
    } else if (comparison.changes.mean.percentage < -5) {
      improvements++;
    }
  }

  return {
    comparisons,
    summary: {
      total: comparisons.length,
      regressions,
      warnings,
      improvements,
    },
  };
}

/**
 * Print comparison results
 */
export function printComparison(
  result: ReturnType<typeof compareWithBaseline>,
): void {
  console.log(`\n${"=".repeat(80)}`);
  console.log("BASELINE COMPARISON");
  console.log("=".repeat(80));

  if (result.comparisons.length === 0) {
    console.log("No comparisons available.");
    return;
  }

  // Print summary
  console.log(`\nTotal benchmarks: ${result.summary.total}`);
  console.log(`Regressions (>25%): ${result.summary.regressions}`);
  console.log(`Warnings (>10%): ${result.summary.warnings}`);
  console.log(`Improvements: ${result.summary.improvements}`);

  // Print each comparison
  for (const comparison of result.comparisons) {
    console.log(formatComparison(comparison));
  }

  // Overall verdict
  console.log(`\n${"=".repeat(80)}`);
  if (result.summary.regressions > 0) {
    console.log("❌ CRITICAL REGRESSIONS DETECTED");
    process.exitCode = 1;
  } else if (result.summary.warnings > 0) {
    console.log("⚠️  Performance warnings detected");
  } else if (result.summary.improvements > 0) {
    console.log("✅ Performance improvements detected!");
  } else {
    console.log("✅ Performance is stable");
  }
  console.log("=".repeat(80));
}

/**
 * Update baseline with current results
 */
export function updateBaseline(currentReport: BenchmarkReport): void {
  const existingBaseline = loadBaseline();

  if (existingBaseline) {
    // Archive existing baseline
    archiveReport(existingBaseline, "baseline-old");
    console.log("📦 Previous baseline archived");
  }

  saveBaseline(currentReport);
  console.log("✅ Baseline updated successfully");
}

/**
 * Generate a comparison report for CI
 */
export function generateCIReport(
  result: ReturnType<typeof compareWithBaseline>,
): string {
  const lines: string[] = [];

  lines.push("## Benchmark Results\n");

  if (result.comparisons.length === 0) {
    lines.push("No baseline comparison available.\n");
    return lines.join("\n");
  }

  // Summary table
  lines.push("### Summary\n");
  lines.push("| Metric | Count |");
  lines.push("|--------|-------|");
  lines.push(`| Total Benchmarks | ${result.summary.total} |`);
  lines.push(`| Critical Regressions (>25%) | ${result.summary.regressions} |`);
  lines.push(`| Warnings (>10%) | ${result.summary.warnings} |`);
  lines.push(`| Improvements | ${result.summary.improvements} |`);
  lines.push("");

  // Detailed results
  lines.push("### Detailed Results\n");

  // Group by regression status
  const critical = result.comparisons.filter(
    (c) => c.regression === "critical",
  );
  const warned = result.comparisons.filter((c) => c.regression === "warning");
  const improved = result.comparisons.filter(
    (c) => c.changes.mean.percentage < -5,
  );
  const stable = result.comparisons.filter(
    (c) => c.regression === "none" && c.changes.mean.percentage >= -5,
  );

  if (critical.length > 0) {
    lines.push("#### ❌ Critical Regressions\n");
    lines.push("| Benchmark | Baseline | Current | Change |");
    lines.push("|-----------|----------|---------|--------|");
    for (const c of critical) {
      lines.push(
        `| ${c.name} (${c.schema}) | ${c.baseline.mean.toFixed(2)}ms | ${c.current.mean.toFixed(2)}ms | +${c.changes.mean.percentage.toFixed(1)}% |`,
      );
    }
    lines.push("");
  }

  if (warned.length > 0) {
    lines.push("#### ⚠️ Warnings\n");
    lines.push("| Benchmark | Baseline | Current | Change |");
    lines.push("|-----------|----------|---------|--------|");
    for (const c of warned) {
      lines.push(
        `| ${c.name} (${c.schema}) | ${c.baseline.mean.toFixed(2)}ms | ${c.current.mean.toFixed(2)}ms | +${c.changes.mean.percentage.toFixed(1)}% |`,
      );
    }
    lines.push("");
  }

  if (improved.length > 0) {
    lines.push("#### ✅ Improvements\n");
    lines.push("| Benchmark | Baseline | Current | Change |");
    lines.push("|-----------|----------|---------|--------|");
    for (const c of improved) {
      lines.push(
        `| ${c.name} (${c.schema}) | ${c.baseline.mean.toFixed(2)}ms | ${c.current.mean.toFixed(2)}ms | ${c.changes.mean.percentage.toFixed(1)}% |`,
      );
    }
    lines.push("");
  }

  if (stable.length > 0 && stable.length <= 10) {
    lines.push("#### ⚪ Stable\n");
    lines.push("| Benchmark | Mean |");
    lines.push("|-----------|------|");
    for (const c of stable) {
      lines.push(
        `| ${c.name} (${c.schema}) | ${c.current.mean.toFixed(2)}ms |`,
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}
