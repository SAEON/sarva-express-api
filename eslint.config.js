const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  prettier,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        process: 'readonly',
        console: 'readonly',
        module: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      // Error prevention
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

      // Style consistency
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'indent': ['error', 2],

      // Best practices
      'arrow-body-style': ['error', 'as-needed'],
      'camelcase': ['error', { properties: 'never' }],
      'eqeqeq': ['error', 'always'],
      'object-shorthand': 'error',

      // ES6+ features
      'arrow-parens': ['error', 'always'],
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
    },
  },
];
