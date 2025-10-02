import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'

export default defineConfig([
    globalIgnores([
        'dist/**',
        'node_modules/**',
        'coverage/**',
        '__tests__/**',
        'vite.config.ts',
        'eslint.config.ts',
        'cypress.config.ts',
    ]),
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: { js, eslintPluginPrettier },
        extends: ['js/recommended'],
        languageOptions: { globals: globals.browser },
    },
    tseslint.configs.recommended,
    eslintConfigPrettier,
])
