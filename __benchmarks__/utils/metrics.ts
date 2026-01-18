/**
 * Metrics collection and statistical analysis for benchmarks
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { arch, cpus, platform } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface BenchmarkSample {
  duration: number; // milliseconds
  timestamp: number; // Unix timestamp
}

export interface BenchmarkMetrics {
  name: string;
  schema: string;
  samples: number[];
  statistics: {
    mean: number;
    median: number;
    min: number;
    max: number;
    stddev: number;
    p50: number;
    p95: number;
    p99: number;
    variance: number;
  };
  metadata: {
    iterations: number;
    timestamp: string;
  };
}

export interface BenchmarkReport {
  version: string;
  timestamp: string;
  environment: {
    nodeVersion: string;
    platform: string;
    arch: string;
    cpuModel: string;
    cpuCores: number;
    totalMemory: number;
  };
  benchmarks: BenchmarkMetrics[];
}

/**
 * Calculate statistical metrics from samples
 */
export function calculateStatistics(
  samples: number[],
): BenchmarkMetrics["statistics"] {
  const sorted = [...samples].sort((a, b) => a - b);
  const n = sorted.length;

  // Mean
  const mean = sorted.reduce((sum, val) => sum + val, 0) / n;

  // Median (p50)
  const median = sorted[Math.floor(n / 2)];

  // Min/Max
  const min = sorted[0];
  const max = sorted[n - 1];

  // Variance and Standard Deviation
  const variance =
    sorted.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const stddev = Math.sqrt(variance);

  // Percentiles
  const p50 = sorted[Math.floor(n * 0.5)];
  const p95 = sorted[Math.floor(n * 0.95)];
  const p99 = sorted[Math.floor(n * 0.99)];

  return {
    mean,
    median,
    min,
    max,
    stddev,
    p50,
    p95,
    p99,
    variance,
  };
}

/**
 * Create a benchmark metrics object
 */
export function createMetrics(
  name: string,
  schema: string,
  samples: number[],
  iterations: number,
): BenchmarkMetrics {
  return {
    name,
    schema,
    samples,
    statistics: calculateStatistics(samples),
    metadata: {
      iterations,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Get current environment information
 */
export function getEnvironment() {
  const cpu = cpus()[0];
  return {
    nodeVersion: process.version,
    platform: platform(),
    arch: arch(),
    cpuModel: cpu.model,
    cpuCores: cpus().length,
    totalMemory: require("node:os").totalmem(),
  };
}

/**
 * Create a benchmark report
 */
export function createReport(benchmarks: BenchmarkMetrics[]): BenchmarkReport {
  // Read package.json for version
  const packageJsonPath = join(__dirname, "../../package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

  return {
    version: packageJson.version,
    timestamp: new Date().toISOString(),
    environment: getEnvironment(),
    benchmarks,
  };
}

/**
 * Save benchmark report to file
 */
export function saveReport(report: BenchmarkReport, filename: string): void {
  const reportPath = join(__dirname, "../reports", filename);
  writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");
  console.log(`\n✅ Benchmark report saved to: ${reportPath}`);
}

/**
 * Load benchmark report from file
 */
export function loadReport(filename: string): BenchmarkReport | null {
  const reportPath = join(__dirname, "../reports", filename);
  if (!existsSync(reportPath)) {
    return null;
  }
  const content = readFileSync(reportPath, "utf-8");
  return JSON.parse(content);
}

/**
 * Compare two benchmark metrics
 */
export interface MetricsComparison {
  name: string;
  schema: string;
  current: BenchmarkMetrics["statistics"];
  baseline: BenchmarkMetrics["statistics"];
  changes: {
    mean: { value: number; percentage: number };
    median: { value: number; percentage: number };
    p95: { value: number; percentage: number };
    p99: { value: number; percentage: number };
  };
  regression: "none" | "warning" | "critical";
}

export function compareMetrics(
  current: BenchmarkMetrics,
  baseline: BenchmarkMetrics,
): MetricsComparison {
  const changes = {
    mean: {
      value: current.statistics.mean - baseline.statistics.mean,
      percentage:
        ((current.statistics.mean - baseline.statistics.mean) /
          baseline.statistics.mean) *
        100,
    },
    median: {
      value: current.statistics.median - baseline.statistics.median,
      percentage:
        ((current.statistics.median - baseline.statistics.median) /
          baseline.statistics.median) *
        100,
    },
    p95: {
      value: current.statistics.p95 - baseline.statistics.p95,
      percentage:
        ((current.statistics.p95 - baseline.statistics.p95) /
          baseline.statistics.p95) *
        100,
    },
    p99: {
      value: current.statistics.p99 - baseline.statistics.p99,
      percentage:
        ((current.statistics.p99 - baseline.statistics.p99) /
          baseline.statistics.p99) *
        100,
    },
  };

  // Determine regression severity
  let regression: "none" | "warning" | "critical" = "none";
  if (changes.mean.percentage > 25) {
    regression = "critical";
  } else if (changes.mean.percentage > 10) {
    regression = "warning";
  }

  return {
    name: current.name,
    schema: current.schema,
    current: current.statistics,
    baseline: baseline.statistics,
    changes,
    regression,
  };
}

/**
 * Format a comparison result as human-readable text
 */
export function formatComparison(comparison: MetricsComparison): string {
  const lines: string[] = [];

  lines.push(`\n${comparison.name} (${comparison.schema})`);
  lines.push(`${"=".repeat(60)}`);

  const formatChange = (value: number, percentage: number): string => {
    const sign = value >= 0 ? "+" : "";
    const color = value > 0 ? "🔴" : value < 0 ? "🟢" : "⚪";
    return `${color} ${sign}${value.toFixed(2)}ms (${sign}${percentage.toFixed(1)}%)`;
  };

  lines.push(
    `Mean:   ${comparison.baseline.mean.toFixed(2)}ms → ${comparison.current.mean.toFixed(2)}ms ${formatChange(comparison.changes.mean.value, comparison.changes.mean.percentage)}`,
  );
  lines.push(
    `Median: ${comparison.baseline.median.toFixed(2)}ms → ${comparison.current.median.toFixed(2)}ms ${formatChange(comparison.changes.median.value, comparison.changes.median.percentage)}`,
  );
  lines.push(
    `P95:    ${comparison.baseline.p95.toFixed(2)}ms → ${comparison.current.p95.toFixed(2)}ms ${formatChange(comparison.changes.p95.value, comparison.changes.p95.percentage)}`,
  );
  lines.push(
    `P99:    ${comparison.baseline.p99.toFixed(2)}ms → ${comparison.current.p99.toFixed(2)}ms ${formatChange(comparison.changes.p99.value, comparison.changes.p99.percentage)}`,
  );

  if (comparison.regression === "critical") {
    lines.push("\n⚠️  CRITICAL REGRESSION DETECTED (>25% slowdown)");
  } else if (comparison.regression === "warning") {
    lines.push(
      "\n⚠️  Warning: Performance degradation detected (>10% slowdown)",
    );
  } else if (comparison.changes.mean.percentage < -5) {
    lines.push("\n✅ Performance improvement!");
  }

  return lines.join("\n");
}

/**
 * Format metrics as a summary table
 */
export function formatMetricsSummary(metrics: BenchmarkMetrics[]): string {
  const lines: string[] = [];

  lines.push(`\n${"=".repeat(80)}`);
  lines.push("BENCHMARK SUMMARY");
  lines.push("=".repeat(80));

  lines.push(
    `${"Name".padEnd(40)} ${"Mean".padEnd(12)} ${"Median".padEnd(12)} ${"P95".padEnd(12)}`,
  );
  lines.push("-".repeat(80));

  for (const metric of metrics) {
    const name = `${metric.name} (${metric.schema})`.substring(0, 39);
    lines.push(
      `${name.padEnd(40)} ${metric.statistics.mean.toFixed(2).padEnd(12)} ${metric.statistics.median.toFixed(2).padEnd(12)} ${metric.statistics.p95.toFixed(2).padEnd(12)}`,
    );
  }

  lines.push("=".repeat(80));
  return lines.join("\n");
}
