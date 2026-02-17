import path from "path";
import { defineConfig } from "vitest/config";
import * as dotenv from "dotenv";
import { existsSync } from "fs";

// Load .env.test if it exists
if (existsSync(".env.test")) {
  dotenv.config({ path: ".env.test" });
}

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    pool: "forks",
    fileParallelism: false, // Run test files sequentially to avoid DB conflicts
    testTimeout: 30000, // 30 second timeout per test
    hookTimeout: 30000, // 30 second timeout for hooks
    teardownTimeout: 30000, // 30 second timeout for teardown
    env: {
      // Use TEST_DATABASE_URL from .env.test if available, otherwise use mock
      DATABASE_URL:
        process.env.TEST_DATABASE_URL ||
        "postgresql://test:test@localhost:5432/test",
      KV_REST_API_URL: "http://localhost:8080",
      KV_REST_API_TOKEN: "test-token",
      BETTER_AUTH_SECRET: "test-secret-for-auth-minimum-32-characters-long",
      BETTER_AUTH_URL: "http://localhost:3000",
      GOOGLE_CLIENT_ID: "test-google-client-id",
      GOOGLE_CLIENT_SECRET: "test-google-client-secret",
      RESEND_API_KEY: "test-resend-key",
      UPLOADTHING_TOKEN: "test-uploadthing-token",
    },
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
