import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
    {
        files: ['**/*.ts'],
        languageOptions: 
        {
            parser: parser,
            parserOptions: 
            {
                ecmaVersion: 'latest',
                sourceType: 'module'
            }
        },
        plugins: 
        {
            '@typescript-eslint': tseslint
        },
        rules: 
        {
            'brace-style': ['error', 'allman', 
            { 
                allowSingleLine: false 
            }],
            'indent': ['error', 4],
            'object-curly-newline': ['error', 
            {
                ObjectExpression: 'always',
                ObjectPattern: 
                { 
                    multiline: true 
                },
                ImportDeclaration: 'never',
                ExportDeclaration: 
                { 
                    multiline: true, 
                    minProperties: 1 
                }
            }],
            'object-property-newline': ['error', 
            { 
                allowAllPropertiesOnSameLine: false 
            }],
            '@typescript-eslint/no-explicit-any': 'off'
        }
    }
];
