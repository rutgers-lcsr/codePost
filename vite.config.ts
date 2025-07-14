import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            entry: "src/index.ts",
            name: "CodePostSDK",
            formats: ["es", "cjs", "umd"],
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            external: ["cross-fetch"],
        },
    },
    plugins: [dts()],
});
