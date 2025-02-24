import { defineConfig } from "vite";
import { resolve } from "path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  build: {
    lib: {
      // eslint-disable-next-line no-undef
      entry: resolve(__dirname, "lib/index.jsx"),
      formats: ["es"],
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        manualChunks: false,
        entryFileNames: "main.js",
      },
    },
  },
});
