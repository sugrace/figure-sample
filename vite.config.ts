import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@atoms": "/src/atoms",
      "@types/*": "/src/types/*",
    },
  },
});
