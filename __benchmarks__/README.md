# Prismark Performance Benchmarks

Comprehensive performance testing suite for prisma-arktype to measure generation speed and identify bottlenecks.

## ✅ Working Benchmarks

- **Annotation Extraction**: Fully functional with 1.2x-67x performance comparisons
- **Generation Timing**: Single-run measurements showing throughput (models/sec, fields/sec)

## ⚠️ Known Limitations

**Frozen Global Arrays Issue**: Generators use module-level frozen arrays, limiting benchmarks to single-run measurements instead of statistical iterations. See "Technical Details" below for full explanation.

## Quick Start

```bash
# Run all benchmarks
pnpm bench

# Run specific benchmark suites
pnpm bench:generation      # ✅ Generation timing (single-run)
pnpm bench:annotations     # ✅ Annotation extraction (full stats)

# Compare with baseline
pnpm bench:compare

# Update baseline with latest results
pnpm bench:update-baseline
```

## Test Schemas

### Standard Schemas

| Schema | Models | Enums | Fields | Target Time | Description |
|--------|--------|-------|--------|-------------|-------------|
| Small | 5 | 1 | ~30 | <100ms | Baseline performance |
| Medium | 25 | 5 | ~200 | <500ms | Current scale |
| Large | 100 | 20 | ~800 | <5s | Stress test |
| Extreme | 500 | 50 | ~4000 | <30s | Scalability limits |

### Realistic Schemas

| Schema | Models | Description |
|--------|--------|-------------|
| E-commerce | 30 | Products, Orders, Inventory, Customers |
| SaaS | 50 | Multi-tenancy, Subscriptions, Billing, Analytics |
| Social | 40 | Users, Posts, Messages, Feeds, Notifications |

## Benchmark Suites

### 1. End-to-End Generation (`generation.bench.ts`)

Measures complete generation pipeline performance (all 11 processors).

```bash
pnpm bench:generation
```

**What it tests:**
- Full pipeline execution time
- Scaling across schema sizes
- Models per second throughput
- Realistic workload performance

### 2. Processor Benchmarks (`processors.bench.ts`)

Tests each of the 11 generators individually to identify bottlenecks.

```bash
pnpm bench:processors
```

**Processors tested:**
- `processEnums` - Enum schema generation
- `processPlain` - Plain model schemas
- `processWhere` - Where clause schemas
- `processCreate` - Create input schemas
- `processUpdate` - Update input schemas
- `processSelect` - Select schemas
- `processInclude` - Include schemas
- `processOrderBy` - OrderBy schemas
- `processRelations` - Relation schemas
- `processRelationsCreate` - Relation create schemas
- `processRelationsUpdate` - Relation update schemas

### 3. Annotation Extraction (`annotations.bench.ts`)

Measures performance of annotation parsing with different patterns.

```bash
pnpm bench:annotations
```

**What it tests:**
- No annotations (baseline)
- Single annotation (`@hide`)
- Type overwrite (`@typeOverwrite`)
- External schema (`@schema="path:Export"`)
- Inline schema (`@schema="{ ... }"`)
- Multiple annotations
- Heavy documentation with mixed content

### 4. Memory Profiling (`memory.bench.ts`)

Measures heap usage and detects memory leaks.

```bash
pnpm bench:memory
```

**What it tests:**
- Heap growth per schema size
- Memory per model efficiency
- Peak memory usage
- Memory leak detection (repeated generation)
- Per-processor memory footprint

**Note:** Run with `--expose-gc` flag to enable garbage collection:
```bash
node --expose-gc node_modules/.bin/vitest bench --grep "Memory"
```

## Metrics & Statistics

Each benchmark provides:

- **Mean** - Average execution time
- **Median** (P50) - Middle value
- **P95** - 95th percentile
- **P99** - 99th percentile
- **Min/Max** - Fastest/slowest runs
- **Stddev** - Standard deviation

## Baseline Management

### Creating a Baseline

Run benchmarks and establish baseline:

```bash
pnpm bench
pnpm bench:update-baseline
```

This creates `__benchmarks__/reports/baseline.json` and archives the old baseline to `history/`.

### Comparing with Baseline

After running benchmarks:

```bash
pnpm bench:compare
```

**Regression Thresholds:**
- ✅ **Stable**: ±5% variance (acceptable)
- ⚠️ **Warning**: >10% slowdown
- ❌ **Critical**: >25% slowdown

### Example Output

```
BASELINE COMPARISON
================================================================================

End-to-End Generation - Medium schema (25 models)
================================================================
Mean:   245.32ms → 238.15ms 🟢 -7.17ms (-2.9%)
Median: 243.10ms → 236.20ms 🟢 -6.90ms (-2.8%)
P95:    256.45ms → 248.30ms 🟢 -8.15ms (-3.2%)
P99:    262.18ms → 253.40ms 🟢 -8.78ms (-3.3%)

✅ Performance improvement!
```

## CI Integration

Benchmarks run automatically in GitHub Actions:

### When Benchmarks Run

1. **On `main` branch push** - Updates baseline automatically
2. **On PRs with `benchmark` label** - Runs comparison (non-blocking)
3. **Manual workflow dispatch** - Optional baseline update

### Using in PRs

Add the `benchmark` label to your PR to trigger benchmarks:

```bash
# Via GitHub CLI
gh pr edit <pr-number> --add-label benchmark

# Via web UI
# Add "benchmark" label in the PR sidebar
```

### Workflow Features

- ✅ Consistent environment (ubuntu-latest, Node 22)
- ✅ Automatic baseline comparison
- ✅ PR comment with results
- ✅ Warning on critical regressions
- ✅ Artifact upload for historical analysis
- ✅ Automatic baseline updates on main

## Directory Structure

```
__benchmarks__/
├── fixtures/              # Test schemas
│   ├── small.prisma      # 5 models, ~30 fields
│   ├── medium.prisma     # 25 models, ~200 fields
│   ├── large.prisma      # 100 models, ~800 fields
│   ├── extreme.prisma    # 500 models, ~4000 fields
│   └── realistic/        # Real-world schemas
│       ├── ecommerce.prisma
│       ├── saas.prisma
│       └── social.prisma
├── suites/               # Benchmark tests
│   ├── generation.bench.ts
│   ├── processors.bench.ts
│   ├── annotations.bench.ts
│   └── memory.bench.ts
├── utils/                # Utilities
│   ├── schema-loader.ts  # Schema loading
│   ├── metrics.ts        # Statistical analysis
│   └── baseline.ts       # Baseline management
├── scripts/              # Helper scripts
│   ├── compare.ts        # Compare with baseline
│   └── update-baseline.ts
└── reports/              # Generated reports (gitignored)
    ├── latest.json       # Most recent run
    ├── baseline.json     # Current baseline
    └── history/          # Historical results
```

## Performance Targets

| Scenario | Target | Current | Status |
|----------|--------|---------|--------|
| Small schema | <100ms | TBD | - |
| Medium schema | <500ms | TBD | - |
| Large schema | <5s | TBD | - |
| Extreme schema | <30s | TBD | - |

## Identifying Bottlenecks

### 1. Run all benchmarks

```bash
pnpm bench
```

### 2. Check processor breakdown

```bash
pnpm bench:processors
```

Look for processors with disproportionately high times.

### 3. Profile with CPU profiler

```bash
pnpm bench:profile
```

This generates a `.cpuprofile` file. Open in Chrome DevTools:
1. Open Chrome DevTools (F12)
2. Go to "Performance" or "Profiler" tab
3. Click "Load" and select the `.cpuprofile` file

### 4. Check memory usage

```bash
pnpm bench:memory
```

Look for:
- High heap growth
- Memory not returning to baseline after repeated runs
- Per-model memory scaling

## Optimization Opportunities

Based on benchmark results, consider:

1. **Caching annotation extraction results** - Repeated parsing overhead
2. **Replace `.find()` with Map lookups** - O(1) vs O(n) lookups
3. **Deduplicate `generateUniqueAlias`** - Used in multiple generators
4. **Memoize repeated computations** - Same calculations across processors
5. **Optimize string concatenation** - Use arrays and join() in hot paths

## Troubleshooting

### Benchmarks fail to run

```bash
# Ensure project is built first
pnpm build

# Check dependencies
pnpm install
```

### Memory benchmarks show high variance

Run with garbage collection enabled:

```bash
pnpm bench:memory
```

The script already includes `--expose-gc` flag.

### Baseline comparison fails

```bash
# Create a baseline first
pnpm bench
pnpm bench:update-baseline
```

### CI benchmarks not running

- Ensure PR has the `benchmark` label
- Check GitHub Actions permissions
- Verify workflow file syntax

## Contributing

When adding new benchmarks:

1. Add test file to `__benchmarks__/suites/`
2. Use `.bench.ts` suffix
3. Follow naming convention: `feature.bench.ts`
4. Include descriptive test names
5. Use appropriate iteration counts
6. Document what the benchmark measures

Example:

```typescript
import { bench, describe } from 'vitest';
import { loadSchema } from '../utils/schema-loader';

describe('My Feature Performance', () => {
  bench('Feature on small schema', async () => {
    const { dmmf } = await loadSchema('small');
    // Test feature
  }, { iterations: 100 });

  bench('Feature on large schema', async () => {
    const { dmmf } = await loadSchema('large');
    // Test feature
  }, { iterations: 10 });
});
```

## Resources

- [Vitest Benchmark Documentation](https://vitest.dev/guide/features.html#benchmarking)
- [Node.js Performance Profiling](https://nodejs.org/en/docs/guides/simple-profiling/)
- [Chrome DevTools Profiler](https://developer.chrome.com/docs/devtools/performance/)

## License

Same as main project (MIT)

## Technical Details

### Frozen Global Arrays Issue

The generators use module-level mutable arrays that get frozen after processing:

```typescript
// Example from enum.ts
export const processedEnums: ProcessedModel[] = [];

export function processEnums(enums) {
  for (const enumData of enums) {
    processedEnums.push({ /* ... */ });  // ← Pushes to global array
  }
  Object.freeze(processedEnums);  // ← Freezes after processing
}
```

**Impact on Benchmarks**:
- ✅ First iteration: Works fine
- ❌ Second iteration: Throws error (can't push to frozen array)
- ❌ Result: Benchmark shows "NaNx faster" instead of real comparisons

**Current Workaround**: Single-run timing measurements with throughput metrics (models/sec, fields/sec).

**Future Fix**: Refactor generators to avoid global mutable state or use process-isolated benchmark runs.

### Current Benchmark Results

**Annotation Extraction** (3.8M+ ops/sec):
- Simple annotations: 1.2x-5.4x faster than complex patterns
- Caching potential: 67x speedup for repeated extraction

**Generation Timing**:
- Small schema (5 models): ~1ms (4,700+ models/sec, 23,600+ fields/sec)
- Medium schema (25 models): TBD

### Test Schema Status

| Schema | Status | Issue |
|--------|--------|-------|
| small.prisma | ✅ Working | - |
| medium.prisma | ✅ Working | - |
| large.prisma | ❌ Disabled | Multiple `@@index` on same line, model/enum naming conflicts |
| extreme.prisma | ❌ Disabled | Same as large |
| realistic/*.prisma | ❌ Disabled | Duplicate models, missing relation fields |

### Dependencies

- **@prisma/internals@7.2.0**: For `getDMMF()` function (ESM default export)
- **vitest@4.0.16**: Benchmark framework (experimental feature)

```typescript
// Correct import pattern
import prismaInternals from "@prisma/internals";
const { getDMMF } = prismaInternals;
```
