import { defineConfig } from "vite";
import wyw from "@wyw-in-js/vite";

export default defineConfig({
  plugins: [wyw()],
  build: {
    outDir: "build"
  }
});
