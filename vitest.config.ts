import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        include: ["src/**/*.test.ts"],
        setupFiles: ['./vitest.setup.ts'],
        env: loadEnv('test', process.cwd(), ''),
    },
});
