import { defineConfig } from "tsup";

export default defineConfig({
  clean: false,
  entry: ["src/index.ts"],
  onSuccess: "tsc --project tsconfig.declarations.json",
  platform: "browser",
  sourcemap: true,
  splitting: false,
});
