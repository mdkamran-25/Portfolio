/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.stories.tsx",
        "**/*.config.{js,ts}",
        "src/app/**/layout.tsx",
        "src/app/**/page.tsx",
        ".next/",
        "dist/",
        "coverage/",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
        "src/design-system/**": {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
    include: ["**/*.{test,spec}.{js,ts,jsx,tsx}"],
    exclude: [
      "node_modules",
      ".next",
      "dist",
      "coverage",
      "**/*.stories.{js,ts,jsx,tsx}",
      "tests/e2e/**",
      "**/e2e/**",
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/design-system": path.resolve(__dirname, "./src/design-system"),
      "@/features": path.resolve(__dirname, "./src/features"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/shared": path.resolve(__dirname, "./src/shared"),
      "@/test": path.resolve(__dirname, "./src/test"),
    },
  },
});
