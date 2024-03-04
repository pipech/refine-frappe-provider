import js from "@eslint/js";
import pluginStylistic from "@stylistic/eslint-plugin";
import pluginTypescript from "@typescript-eslint/eslint-plugin";
import parserTypescript from "@typescript-eslint/parser";
import pluginImport from "eslint-plugin-import";
import pluginPerfectionist from "eslint-plugin-perfectionist";

/** @type { import("eslint").Linter.FlatConfig[] } */
const config = [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      pluginPerfectionist,
      pluginStylistic,
    },
    rules: {
      // eslint-js
      ...js.configs.all.rules,
      "camelcase": "off",
      "capitalized-comments": "off",
      "id-length": "off",
      "multiline-comment-style": "off",
      "no-magic-numbers": ["error", {
        detectObjects: true,
        enforceConst: true,
        ignore: [-1, 0, 1],
        ignoreArrayIndexes: true,
      }],
      "no-shadow": ["error", {
        allow: ["params"],
        builtinGlobals: false,
        hoist: "functions",
        ignoreOnInitialization: false,
      }],
      "one-var": ["error", "never"],
      "sort-imports": "off",
      "sort-keys": "off",

      // PluginPerfectionist
      "pluginPerfectionist/sort-imports": [
        "error",
        {
          "groups": [
            "type",
            ["builtin", "external"],
            "internal-type",
            "internal",
            ["parent-type", "sibling-type", "index-type"],
            ["parent", "sibling", "index"],
            "side-effect",
            "style",
            "object",
            "unknown",
          ],
          "internal-pattern": [
            "@/**",
            "test/**",
          ],
          "newlines-between": "always",
          "order": "asc",
          "type": "natural",
        },
      ],
      "pluginPerfectionist/sort-objects": [
        "error",
        {
          "custom-groups": {
            id: "id",
          },
          "groups": ["id", "unknown"],
          "order": "asc",
          "partition-by-new-line": true,
          "type": "natural",
        },
      ],

      // PluginStylistic
      ...pluginStylistic.configs.customize({
        arrowParens: true,
        blockSpacing: true,
        braceStyle: "stroustrup",
        commaDangle: "always-multiline",
        flat: true,
        // eslint-disable-next-line no-magic-numbers
        indent: 2,
        jsx: true,
        pluginName: "pluginStylistic",
        quoteProps: "consistent-as-needed",
        quotes: "double",
        semi: true,
      }).rules,
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: parserTypescript,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": pluginTypescript,
      "import": pluginImport,
    },
    rules: {
      // eslint-js
      "no-shadow": "off",

      // PluginImport
      ...pluginImport.configs.recommended.rules,
      ...pluginImport.configs.typescript.rules,
      "import/no-unresolved": "off",

      // PluginTypescript
      ...pluginTypescript.configs.strict.rules,
      "@typescript-eslint/no-shadow": "error",
    },
    settings: {
      "import/parsers": {
        espree: [".js", ".cjs", ".mjs", ".jsx"],
      },
      "import/resolver": {
        node: true,
        typescript: true,
      },
    },
  },
  {
    files: ["**/*.test.{js,jsx,ts,tsx}"],
    rules: {
      // eslint-js
      "max-lines-per-function": "off",
      "no-magic-numbers": "off",

      // PluginTypescript
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
];

export default config;
