import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "app/_stores/authStore.ts",
        "app/_stores/listStore.ts",
        "app/_actions/auth.ts",
        "app/_actions/lists.ts",
        "app/_helpers/session.ts",
        "proxy.ts",
      ],
      exclude: ["**/*.test.ts", "**/*.test.tsx"],
    },
  },
});
