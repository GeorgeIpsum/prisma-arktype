/**
 * Update baseline with latest benchmark results
 */

import { existsSync, readFileSync } from "node:fs";
import { updateBaseline } from "../utils/baseline";
import { loadReport } from "../utils/metrics";

function main() {
  console.log("Loading latest benchmark results...");

  // Check if latest.json exists (simple format from run-and-save.ts)
  const simpleLatestPath = "__benchmarks__/reports/latest.json";
  if (existsSync(simpleLatestPath)) {
    const simpleData = JSON.parse(readFileSync(simpleLatestPath, "utf-8"));

    // Check if this is the simple format (has 'output' field but no 'benchmarks')
    if (simpleData.output && !simpleData.benchmarks) {
      console.log("\n⚠️  Baseline update skipped");
      console.log("=".repeat(80));
      console.log(`Timestamp: ${simpleData.timestamp}`);
      console.log(`Git Branch: ${simpleData.git?.branch || "unknown"}`);
      console.log(`Git Commit: ${simpleData.git?.shortCommit || "unknown"}`);
      console.log(`Status: ${simpleData.status}`);
      console.log(
        "\nBaseline update not available due to benchmark output format.",
      );
      console.log(
        "The current benchmark infrastructure captures console output only.",
      );
      console.log(
        "To enable baseline updates, the benchmarks need to generate structured",
      );
      console.log("BenchmarkReport data with metrics.");
      return;
    }
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

  // Validate report structure
  if (!(latestReport.version && latestReport.benchmarks)) {
    console.error("❌ Invalid report format.");
    console.error(
      "   The latest.json file does not have the expected BenchmarkReport structure.",
    );
    console.error(
      "   Expected fields: version, timestamp, environment, benchmarks",
    );
    process.exit(1);
  }

  console.log(`   Version: ${latestReport.version}`);
  console.log(`   Benchmarks: ${latestReport.benchmarks.length}`);
  console.log("");

  // Confirm update
  console.log(
    "⚠️  This will replace the current baseline with the latest results.",
  );
  console.log("   The existing baseline will be archived to history/");
  console.log("");

  updateBaseline(latestReport);
}

main();
