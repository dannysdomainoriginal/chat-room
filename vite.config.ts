import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "frontend", // 👈 frontend lives here
  publicDir: "../public",
  envDir: "../",
  build: {
    outDir: "../public", // 👈 build straight into /public
    emptyOutDir: false,
    sourcemap: false,
    rollupOptions: {
      input: {
        index: resolve(process.cwd(), "frontend/index.html"),
        chat: resolve(process.cwd(), "frontend/chat.html"),
      },
    },
  },
});
