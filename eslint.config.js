import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'test-results', 'playwright-report', 'storybook-static', 'node_modules', 'figma-plugin/code.js'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Design-system rule: application code must import UI from the design system barrel,
      // never from deep component paths, so the public API stays the single contract.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/design-system/components/*'],
              message: 'Import from "@/design-system" instead of deep component paths.',
            },
          ],
        },
      ],
    },
  },
  {
    // Styling convention: Tailwind token utilities only. BEM class names (block__element, block--modifier)
    // are banned in className strings, so styles never drift into hand-written CSS selectors.
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: `JSXAttribute[name.name='className'] Literal[value=/(^|\\s)[a-z][a-z0-9]*(-[a-z0-9]+)*(__|--)[a-z0-9]/]`,
          message: 'BEM class names (block__element, block--modifier) are not allowed. Use token utilities or a component variant.',
        },
        {
          selector: `JSXAttribute[name.name='className'] TemplateElement[value.raw=/(^|\\s)[a-z][a-z0-9]*(-[a-z0-9]+)*(__|--)[a-z0-9]/]`,
          message: 'BEM class names (block__element, block--modifier) are not allowed. Use token utilities or a component variant.',
        },
      ],
    },
  },
  {
    files: ['src/design-system/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': 'off' },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: { globals: globals.node },
  },
);
