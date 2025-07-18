import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tsParser from '@typescript-eslint/parser';

export default [
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
	      project: "./tsconfig.eslint.json"
      },
      globals: globals.browser,
    },
    plugins: {
      "unused-imports": eslintPluginUnusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "react/prop-types": "off",
    },
  },
  { files: ['**/*.{js,jsx,ts,tsx}'], rules: { 'react/react-in-jsx-scope': 'off' } }
];

