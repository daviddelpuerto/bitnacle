module.exports = {
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 8,
        sourceType: 'module',
    },
    rules: {
        semi: 'error',
        indent: ['error', 4],
        quotes: ['error', 'single'],
        eqeqeq: 'error',
        'linebreak-style': ['error', 'unix']
    },
    env: {
        node: true,
        es6: true
    }
};