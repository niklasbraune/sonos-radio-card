import js from "@eslint/js";
import lit from "eslint-plugin-lit";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/", "node_modules/"] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  lit.configs["flat/recommended"],
  {
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Lit binds `@event=${this.method}` listeners to the host element.
      "@typescript-eslint/unbound-method": "off",
    },
  },
  {
    files: ["test/**/*.ts"],
    rules: {
      // node:test tracks the promises returned by test() itself.
      "@typescript-eslint/no-floating-promises": "off",
    },
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        projectService: false,
        project: "./tsconfig.test.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["test/browser/**/*.ts"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.mocha },
    },
  },
  {
    files: ["*.js", "*.mjs"],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      ...tseslint.configs.disableTypeChecked.languageOptions,
      globals: { ...globals.node },
    },
  },
);
