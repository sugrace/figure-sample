import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/*": "src/*",
      "@atoms": "/src/atoms",
      "@components": "/src/components",
      "@constants": "/src/constants",
    },
  },
});
