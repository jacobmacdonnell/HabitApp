module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [['inline-import', { extensions: ['.sql'] }]], // Support .sql imports for Drizzle
        env: {
            production: {
                plugins: ['transform-remove-console'],
            },
        },
    };
};
