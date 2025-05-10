import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // resolve: {
  //   alias: [{ find: "@", replacement: "/src" }],
  // },
  build: {
    rollupOptions: {
      external: (id) => id.includes("src/dev-only"),
      output: {
        assetFileNames: `assets/[name].v100[extname]`,
        chunkFileNames: `assets/[name].v100.js`,
        entryFileNames: `assets/[name].v100.js`,
        manualChunks(id: string) {
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router-dom/")
          ) {
            return "@react-vendor";
          }
          if (
            id.includes("@mui/icons-material") ||
            id.includes("@mui/material")
          ) {
            return "@mui-vendor";
          }
          if (id.includes("firebase")) {
            return "@firebase";
          }
          if (id.includes("component")) {
            return "@component";
          }
          if (id.includes("@tanstack/react-query")) {
            return "@react-query";
          }
        },
      },
    },
  },
});
