import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";


/** @type {import('eslint').Linter.Config[]} */
export default [
  // Apply to JavaScript, TypeScript, and JSX/TSX files
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},


  // Define global variables
  {languageOptions: { globals: globals.browser }},

  // Apply recommended configurations
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  // Add react-compiler plugin and its rules
  {
    plugins: {
      "react-compiler": reactCompiler,
    },
    rules: {
      "react-compiler/react-compiler": "error",
      "@typescript-eslint/no-unused-vars": "warn", // Set unused variables in TypeScript as warnings
      "no-unused-vars": "warn", // Set unused variables in JavaScript as warnings
    },
  },
];