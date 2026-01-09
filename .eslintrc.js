module.exports = {
    env: {
        node: true,
        es2021: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'script'
    },
    rules: {
        // Relaxed for legacy codebase - only critical errors
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        'no-console': 'off',
        'no-empty': 'warn',
        'no-constant-condition': 'warn',
        'no-prototype-builtins': 'off',
        'no-case-declarations': 'off',

        // Disable style rules for legacy code
        'semi': 'off',
        'quotes': 'off',
        'indent': 'off',
        'comma-dangle': 'off',
        'no-trailing-spaces': 'off',
        'eol-last': 'off'
    },
    ignorePatterns: ['node_modules/', 'package-lock.json']
};
