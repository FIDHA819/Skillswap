import type { Linter } from "eslint";

const config: Linter.Config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  rules: {
    "prettier/prettier": "error",
    "react/react-in-jsx-scope": "off",
    semi: ["error", "always"],
    quotes: ["error", "single"],
    "@typescript-eslint/no-unused-vars": ["warn"],
  },
  settings: {
    react: { version: "detect" },
  },
};

export default config;
