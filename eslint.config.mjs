import js from '@eslint/js';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: ['node_modules/**', '.venv/**'],
  },
  js.configs.recommended,
  // Allow empty catch blocks project-wide (intentional error-swallowing pattern)
  {
    rules: {
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  // Cloudflare Worker (ES module)
  {
    files: ['worker.js'],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2024,
      sourceType: 'module',
    },
  },
  // shared.js — defines globals consumed by other pages; disable no-unused-vars
  {
    files: ['docs/shared.js'],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2024,
      sourceType: 'script',
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
  // game.js and unlimited.js — consume globals from shared.js
  {
    files: ['docs/game.js', 'docs/unlimited.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        WORKER_URL: 'readonly',
        COOKIES: 'writable',
        TRAIT_LABELS: 'readonly',
        showToast: 'readonly',
        buildSuggestions: 'readonly',
        hideSuggestions: 'readonly',
        selectSuggestion: 'readonly',
        updateActiveSugg: 'readonly',
        bindSuggestionBox: 'readonly',
        cookieImgSrc: 'readonly',
      },
      ecmaVersion: 2024,
      sourceType: 'script',
    },
  },
  prettierConfig,
];
