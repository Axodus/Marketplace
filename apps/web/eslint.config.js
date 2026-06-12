import js from "@eslint/js";

export default [
  {
    ignores: ["dist/**", "**/dist/**", "node_modules/**", "coverage/**"]
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        document: "readonly",
        window: "readonly",
        console: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "off"
    }
  }
];
