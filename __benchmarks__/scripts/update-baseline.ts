/**
 * Update baseline with latest benchmark results
 */

import { updateBaseline } from "../utils/baseline";
import { loadReport } from "../utils/metrics";

function main() {
  console.log("Loading latest benchmark results...");

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
