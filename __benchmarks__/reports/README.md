# Benchmark Reports

This directory contains benchmark results and historical data.

## Files

- `baseline.json` - Current performance baseline (tracked in git)
- `latest.json` - Most recent benchmark run (gitignored)
- `history/` - Historical benchmark results (gitignored)
- `.generated/` - Generated schema output during benchmarks (gitignored)

## Creating a Baseline

To establish a performance baseline:

```bash
# Run benchmarks
pnpm bench

# Update baseline
pnpm bench:update-baseline
```

The baseline is used for regression detection in CI and local development.

## Comparing with Baseline

After running benchmarks:

```bash
pnpm bench:compare
```

This will show performance changes compared to the baseline.

## Baseline Format

The `baseline.json` file contains:

```json
{
  "version": "2.4.0",
  "timestamp": "2026-01-17T...",
  "environment": {
    "nodeVersion": "v22.18.0",
    "platform": "linux",
    "arch": "x64",
    "cpuModel": "...",
    "cpuCores": 4,
    "totalMemory": 16777216000
  },
  "git": {
    "commit": "abc123...",
    "branch": "main"
  },
  "benchmarks": [
    {
      "name": "Small schema (5 models, ~30 fields)",
      "schema": "small",
      "samples": [...],
      "statistics": {
        "mean": 45.23,
        "median": 44.80,
        "min": 42.10,
        "max": 52.30,
        "stddev": 2.15,
        "p50": 44.80,
        "p95": 49.50,
        "p99": 51.20,
        "variance": 4.62
      },
      "metadata": {
        "iterations": 100,
        "timestamp": "2026-01-17T..."
      }
    }
  ]
}
```

## Regression Thresholds

- ✅ **Stable**: ±5% variance
- ⚠️ **Warning**: >10% slowdown
- ❌ **Critical**: >25% slowdown
