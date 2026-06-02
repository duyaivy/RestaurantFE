import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import tanstackQuery from "@tanstack/eslint-plugin-query";

const eslintConfig = defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,

  {
    settings: {
      react: {
        version: "19.2.4",
      },
    },
  },

  {
    plugins: {
      "@tanstack/query": tanstackQuery,
    },
    rules: {
      ...tanstackQuery.configs.recommended.rules,
    },
  },

  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".history/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
