import { defineConfig } from "vite";
import { resolve } from "path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    viteStaticCopy({
      targets: [
        {
          src: "lib/*.d.ts",
          dest: "",
        },
      ],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.js"),
      formats: ["es"],
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        entryFileNames: "main.js",
      },
    },
  },
});
