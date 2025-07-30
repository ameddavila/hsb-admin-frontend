// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import history from "connect-history-api-fallback";
import type { NextHandleFunction } from "connect";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
    // ✅ Middleware SPA fallback SOLO para desarrollo (vite dev)
    {
      name: "spa-fallback",
      configureServer(server) {
        console.log("🚀 SPA fallback activo para desarrollo");
        const historyMiddleware = history({
          // Evita sobrescribir recursos como /@vite/client
          htmlAcceptHeaders: ["text/html", "application/xhtml+xml"],
          rewrites: [{ from: /\/[^.]*$/, to: "/index.html" }], // solo rutas sin punto
          disableDotRule: true,
        }) as NextHandleFunction;

        server.middlewares.use(historyMiddleware);
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          zustand: ["zustand"],
          apexcharts: ["apexcharts", "react-apexcharts"],
          calendar: ["@fullcalendar/react", "@fullcalendar/core", "@fullcalendar/daygrid"],
        },
      },
    },
  },
});
