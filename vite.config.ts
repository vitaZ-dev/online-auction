import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pkg from "./package.json";

const version = "v" + pkg.version.replace(/\./g, "_");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // resolve: {
  //   alias: [{ find: "@", replacement: "/src" }],
  // },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@emotion/react",
      "@emotion/styled",
      "@mui/material",
      "@mui/icons-material",
    ],
  },
  build: {
    rollupOptions: {
      external: (id) => id.includes("src/dev-only"),
      output: {
        assetFileNames: `assets/[name].${version}[extname]`,
        chunkFileNames: `assets/[name].${version}.js`,
        entryFileNames: `assets/[name].${version}.js`,
        manualChunks(id: string) {
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router-dom/") ||
            id.includes("node_modules/@emotion") ||
            id.includes("node_modules/@mui")
          ) {
            return "@react-vendor";
          }
          if (id.includes("node_modules/firebase")) {
            return "@firebase";
          }
          if (id.includes("component")) {
            if (id.includes("common")) return "@component-common";
            if (id.includes("UI")) return "@component-UI";
          }
          if (id.includes("node_modules/@tanstack/react-query")) {
            return "@react-query";
          }
        },
      },
    },
  },
});
