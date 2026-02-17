import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "**/*.config.ts",
        "**/*.config.js",
        "**/dist/**",
        "**/.next/**",
        "src/components/ui/**", // shadcn components (external)
        "src/app/**", // Next.js pages (no unit tests)
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
