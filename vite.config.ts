import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/*": "src/*",
      "@atoms": "/src/atoms",
      "@utils": "/src/utils",
      "@hooks": "/src/hooks",
      "@components": "/src/components",
      "@constants": "/src/constants",
    },
  },
});
