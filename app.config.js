import 'dotenv/config';

export default {
    expo: {
        name: 'cookandchat',
        slug: 'chatcook-client',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/images/carousel.png',
        scheme: 'myapp',
        userInterfaceStyle: 'automatic',
        extra: {
            FIREBASE_APIKEY: process.env.FIREBASE_APIKEY,
            FIREBASE_AUTHDOMAIN: process.env.FIREBASE_AUTHDOMAIN,
            FIREBASE_PROJECTID: process.env.FIREBASE_PROJECTID,
            //   FIREBASE_STOREAGEBUCKET: process.env.FIREBASE_STOREAGEBUCKET,
            //   FIREBASE_MESSAGINGSENDERID: process.env.FIREBASE_MESSAGINGSENDERID,
            FIREBASE_APPID: process.env.FIREBASE_APPID,
            eas: {
                projectId: 'c500099c-ee9d-47b3-8477-38f9a135610f',
            },
            EXPO_PUBLIC_GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
        },
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
        },
        android: {
            package: 'com.kariemgerges.chatncook',
            adaptiveIcon: {
                foregroundImage: './assets/images/adaptive-icon.png',
                backgroundColor: '#ffffff',
            },
        },
        web: {
            bundler: 'metro',
            output: 'static',
            favicon: './assets/images/favicon.png',
        },
        plugins: [
            'expo-router',
            [
                'expo-splash-screen',
                {
                    image: './assets/images/splash-icon.png',
                    imageWidth: 200,
                    resizeMode: 'contain',
                    backgroundColor: '#ffffff',
                },
            ],
        ],
        experiments: {
            typedRoutes: true,
        },
    },
};
