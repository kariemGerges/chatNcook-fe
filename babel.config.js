module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'react-native-reanimated/plugin', // ✅ ONLY THIS ONE for now testing the item order
        ],
    };
};
