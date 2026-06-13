import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**", "src/**", "dist/**"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];