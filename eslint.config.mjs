import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [{
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
}, {
  ignores: [
    "**/node_modules/**",
    ".next/**",
    "tests/**",
    "**/*.test.ts",
    "**/*.test.tsx",
    "test-*.js",
    "test-*.cjs",
    "debug-*.sql",
    "**/coverage/**",
    "**/dist/**"
  ],
}, pluginJs.configs.recommended, ...tseslint.configs.recommended, ...compat.extends("next/core-web-vitals"), {
  files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },
    parserOptions: {
      project: ['./tsconfig.json'],
      tsconfigRootDir: __dirname,
    },
  },
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_",
      },
    ],
    "@typescript-eslint/no-require-imports": "off",
  },
}];

export default eslintConfig;
