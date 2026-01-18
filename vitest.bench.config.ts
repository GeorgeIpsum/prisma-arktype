import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["__benchmarks__/**/*.bench.ts"],
    exclude: [
      "__benchmarks__/utils/**",
      "__benchmarks__/fixtures/**",
      "__benchmarks__/reports/**",
    ],
    benchmark: {
      include: ["__benchmarks__/**/*.bench.ts"],
      exclude: [
        "__benchmarks__/utils/**",
        "__benchmarks__/fixtures/**",
        "__benchmarks__/reports/**",
      ],
      reporters: ["default"],
    },
  },
});
