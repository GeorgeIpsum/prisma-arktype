/**
 * Compare current benchmark results with baseline
 */

import { compareWithBaseline, printComparison } from "../utils/baseline";
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

  const result = compareWithBaseline(latestReport);
  printComparison(result);
}

main();
