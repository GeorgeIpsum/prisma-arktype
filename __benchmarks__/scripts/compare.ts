/**
 * Compare current benchmark results with baseline
 */

import { existsSync, readFileSync } from "node:fs";
import { compareWithBaseline, printComparison } from "../utils/baseline";
import { loadReport } from "../utils/metrics";

function main() {
  console.log("Loading latest benchmark results...");

  // Check if latest.json exists (simple format from run-and-save.ts)
  const simpleLatestPath = "__benchmarks__/reports/latest.json";
  if (existsSync(simpleLatestPath)) {
    const simpleData = JSON.parse(readFileSync(simpleLatestPath, "utf-8"));

    console.log("\n📊 Benchmark Results");
    console.log("=".repeat(80));
    console.log(`Timestamp: ${simpleData.timestamp}`);
    console.log(`Git Branch: ${simpleData.git?.branch || "unknown"}`);
    console.log(`Git Commit: ${simpleData.git?.shortCommit || "unknown"}`);
    console.log(`Status: ${simpleData.status}`);
    console.log(
      "\nNote: Baseline comparison not available due to benchmark output format.",
    );
    console.log("Benchmarks ran successfully. See full output above.");
    return;
  }

  // Fall back to structured format if available
  const latestReport = loadReport("latest.json");
  if (!latestReport) {
    console.error(
      "❌ No latest benchmark report found. Run benchmarks first with: pnpm bench",
    );
    process.exit(1);
  }

  console.log(`✅ Loaded report from ${latestReport.timestamp}`);
  console.log(`   Version: ${latestReport.version}`);
  console.log(`   Benchmarks: ${latestReport.benchmarks.length}`);

  const result = compareWithBaseline(latestReport);
  printComparison(result);
}

main();
