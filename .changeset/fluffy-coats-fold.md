---
"prisma-arktype": minor
---

✨ Features

- Added date fields support for where schemas
- Improved Prisma bytes field handling - now generates as either Uint8Array or Buffer type in schema based on context
- Added database array type filters support
- Added comprehensive scalar filters for better query capabilities

🐛 Fixes

- Fixed bytes fields being returned as type unknown
- Fixed benchmark scripting issues

⚡ Performance

- Set up comprehensive benchmarking infrastructure with:
  - Multiple test fixtures (small, medium, large, extreme schemas)
  - Realistic scenarios (e-commerce, SaaS, social media schemas)
  - Benchmark suites for annotations and generation
  - Automated baseline tracking and comparison tools
  - GitHub Actions workflow for CI benchmarks

🔧 Refactoring

- Refactored runtime schema dependencies for better modularity
- Cached isPrismaV7OrHigher result to avoid repeated file I/O operations
- Removed unused code

🏗️ Infrastructure

- Added benchmark GitHub Actions workflow with DATABASE_URL configuration
- Updated benchmark workflow configuration
- Added comprehensive benchmark documentation and tooling
