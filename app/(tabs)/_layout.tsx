import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet, Text, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { HapticTab } from '@/components/HapticTab';
import { Home, CookingPot, HeartHandshake , User } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CookChatColors = {
    light: {
        primary: '#FF6B35',
        secondary: '#FFD0BA',
        inactive: '#9CA3AF',
        tabBarBg: '#FFFFFF',
    },
    dark: {
        primary: '#FF8D5C',
        secondary: '#5D3319',
        inactive: '#6B7280',
        tabBarBg: '#121212',
    },
};

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme() ?? 'light';

    return (
        <Tabs
            tabBar={({ state, descriptors, navigation }) => (
                <View
                    style={[
                        styles.tabBar,
                        {
                            backgroundColor:
                                CookChatColors[colorScheme].tabBarBg,
                            paddingBottom: insets.bottom || 16,
                        },
                    ]}
                >
                    {state.routes.map((route, index) => {
                        const isFocused = state.index === index;
                        const label =
                            descriptors[route.key].options.title || route.name;

                        const IconComponent =
                            route.name === 'index'
                                ? Home
                                : route.name === 'recipe'
                                ? CookingPot
                                : route.name === 'chat'
                                ? HeartHandshake 
                                : User;

                        const iconColor = isFocused
                            ? CookChatColors[colorScheme].primary
                            : CookChatColors[colorScheme].inactive;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });
                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        return (
                            <HapticTab
                                key={route.key}
                                onPress={onPress}
                                style={styles.tabItem}
                            >
                                <View style={styles.iconContainer}>
                                    <View
                                        style={[
                                            styles.iconCircle,
                                            isFocused && {
                                                backgroundColor:
                                                    CookChatColors[colorScheme]
                                                        .secondary,
                                            },
                                        ]}
                                    >
                                        <IconComponent
                                            size={24}
                                            color={iconColor}
                                        />
                                    </View>
                                    {isFocused && (
                                        <Text
                                            style={[
                                                styles.tabLabel,
                                                { color: iconColor },
                                            ]}
                                        >
                                            {label}
                                        </Text>
                                    )}
                                </View>
                            </HapticTab>
                        );
                    })}
                </View>
            )}
            screenOptions={{ headerShown: false }}
        >
            <Tabs.Screen name="index" options={{ title: 'Home' }} />
            <Tabs.Screen name="recipe" options={{ title: 'Recipes' }} />
            <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 8,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -5 },
        elevation: 15,
        height: Platform.OS === 'ios' ? 90 : 63,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    iconContainer: {
        alignItems: 'center',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});