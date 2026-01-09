module.exports = {
    env: {
        node: true,
        es2021: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'no-console': 'off',
        'semi': ['error', 'always'],
        'quotes': ['warn', 'single', { avoidEscape: true }]
    },
    ignorePatterns: ['node_modules/', 'package-lock.json']
};
