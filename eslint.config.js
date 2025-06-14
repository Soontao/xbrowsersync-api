import globals from 'globals';
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: { project: './tsconfig.eslint.json' },
      globals: { ...globals.browser, ...globals.jest, ...globals.node, JSX: 'readonly' },
    },
    plugins: { '@typescript-eslint': tsPlugin, prettier: prettierPlugin, import: importPlugin },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      '@typescript-eslint/comma-dangle': 'off',
      '@typescript-eslint/indent': 'off',
      '@typescript-eslint/lines-between-class-members': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-use-before-define': 'off',
      'class-methods-use-this': 'off',
      'consistent-return': 'off',
      'func-style': 'warn',
      'global-require': 'off',
      'import/extensions': 'off',
      'import/no-dynamic-require': 'off',
      'import/order': 'off',
      'import/prefer-default-export': 'off',
      'no-bitwise': 'off',
      'no-empty': 'off',
      'no-nested-ternary': 'off',
      'no-param-reassign': 'off',
      'no-undef': 'error',
      'no-underscore-dangle': 'off',
      'no-unreachable': 'warn',
      'no-unused-vars': 'warn',
      'prefer-destructuring': 'off',
      'prettier/prettier': 'warn',
      'sort-imports': 'off',
      'spaced-comment': 'off',
    },
  },
  { ignores: ['src/**/*.spec.ts', 'dist', 'eslint.config.js'] },
];
