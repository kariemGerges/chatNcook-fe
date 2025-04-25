import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

// redux store imports
import { Provider } from 'react-redux';
import store from '@/store';
import { listenToAuthChanges } from '@/store/authListener';
import { listenToUserChats } from '@/store/thunks/chatThunks';

import { useAppSelector } from '@/store/hooks';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    // Component that sets up listeners after the store is available
    const ListenerInitializer = () => {
        const user = useAppSelector((state) => state.user.user);

        // Listen to authentication changes
        useEffect(() => {
            // Initialize auth state listener
            listenToAuthChanges();
        }, []);

        useEffect(() => {
            // Initialize chat listeners when user changes
            const unsubscribe = store.dispatch(
                listenToUserChats(user?.uid || null)
            );

            return () => {
                if (unsubscribe) unsubscribe();
            };
        }, [user]);

        return null;
    };

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <Provider store={store}>
            <ThemeProvider
                value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
            >
                <ListenerInitializer />
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>
        </Provider>
    );
}
