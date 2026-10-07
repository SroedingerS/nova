import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { realpathSync } from "node:fs";
export default defineConfig({
  root: realpathSync(process.cwd()),
  plugins: [react()],
  base: "/nova/",
  build: { target: "es2020" },
  server: { port: 5173, strictPort: true },
});
