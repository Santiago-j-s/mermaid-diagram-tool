import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import nextConfig from "@next/eslint-plugin-next";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // Global ignores
  globalIgnores([
    ".next/",
    "node_modules/",
    "out/",
    "dist/",
    "build/",
    "*.config.js",
    "*.config.mjs",
    "pnpm-lock.yaml",
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "@next/next": nextConfig,
    },
    extends: ["react-hooks/recommended"],
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      ...nextConfig.configs["recommended"].rules,
      "@next/next/no-img-element": "off",
    },
  },
]);
