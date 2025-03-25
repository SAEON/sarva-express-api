
module.exports = {
    env: {
      node: true,
      commonjs: true,
      es2021: true,
      jest: true,
    },
    extends: ["eslint:recommended", "prettier"],
    parserOptions: {
      ecmaVersion: 12,
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-var": "error",
      "prefer-const": "error",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      
      "semi": ["error", "always"],
      "quotes": ["error", "single", { avoidEscape: true }],
      "comma-dangle": ["error", "always-multiline"],
      "indent": ["error", 2],
      
      "arrow-body-style": ["error", "as-needed"],
      "camelcase": ["error", { properties: "never" }],
      "eqeqeq": ["error", "always"],
      "no-duplicate-imports": "error",
      "object-shorthand": "error",
      
      "arrow-parens": ["error", "always"],
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
    },
  };