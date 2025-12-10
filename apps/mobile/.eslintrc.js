module.exports = {
    extends: 'universe/native',
    rules: {
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        '@typescript-eslint/no-explicit-any': 'warn',
        'react-hooks/exhaustive-deps': 'warn',
    },
    env: {
        node: true,
    },
};
