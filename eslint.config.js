import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { ESLint } from 'eslint'; // 변경 부분
import tseslintParser from '@typescript-eslint/parser'; // 변경 부분
import tseslintPlugin from '@typescript-eslint/eslint-plugin'; // 변경 부분

export default new ESLint({
    baseConfig: {
        ignorePatterns: ['dist'],
        parser: tseslintParser,
        extends: [
            'eslint:recommended',
            'plugin:@typescript-eslint/recommended', // 추가 부분
        ],
        parserOptions: {
            ecmaVersion: 2020,
            sourceType: 'module', // 추가 부분
        },
        settings: {
            react: {
                version: 'detect', // 추가 부분
            },
        },
        globals: globals.browser,
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            '@typescript-eslint': tseslintPlugin, // 추가 부분
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
        },
    },
});