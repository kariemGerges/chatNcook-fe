// // app/(tabs)/_layout.tsx
// import { Tabs } from 'expo-router';
// import React from 'react';
// import {
//     View,
//     StyleSheet,
//     Text,
//     Dimensions,
//     TouchableOpacity,
//     Platform,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { HapticTab } from '@/components/HapticTab';
// import {
//     Home,
//     CookingPot,
//     HeartHandshake,
//     User,
//     CirclePlus,
// } from 'lucide-react-native';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// const CookChatColors = {
//     light: {
//         primary: '#FF6B35',
//         secondary: '#FFD0BA',
//         inactive: '#9CA3AF',
//         tabBarBg: '#FFFFFF',
//     },
//     dark: {
//         primary: '#FF8D5C',
//         secondary: '#5D3319',
//         inactive: '#6B7280',
//         tabBarBg: '#121212',
//     },
// };

// export default function TabLayout() {
//     const insets = useSafeAreaInsets();
//     const scheme = useColorScheme() ?? 'light';

//     return (
//         <Tabs
//             screenOptions={{ headerShown: false }}
//             tabBar={({ state, descriptors, navigation }) => (
//                 <View
//                     style={[
//                         styles.tabBar,
//                         {
//                             backgroundColor: CookChatColors[scheme].tabBarBg,
//                             paddingBottom: insets.bottom || 16,
//                         },
//                     ]}
//                 >
//                     {state.routes.map((route, idx) => {
//                         // hide the dummy modal route from the tab items
//                         if (route.name === 'btn') {
//                             return null;
//                         }

//                         const isFocused = state.index === idx;
//                         const label =
//                             descriptors[route.key].options.title || route.name;

//                         const Icon =
//                             route.name === 'index'
//                                 ? Home
//                                 : route.name === 'recipe'
//                                 ? CookingPot
//                                 : route.name === 'chat'
//                                 ? HeartHandshake
//                                 : User;

//                         const color = isFocused
//                             ? CookChatColors[scheme].primary
//                             : CookChatColors[scheme].inactive;

//                         const onPress = () => {
//                             const event = navigation.emit({
//                                 type: 'tabPress',
//                                 target: route.key,
//                                 canPreventDefault: true,
//                             });
//                             if (!isFocused && !event.defaultPrevented) {
//                                 navigation.navigate(route.name);
//                             }
//                         };

//                         return (
//                             <HapticTab
//                                 key={route.key}
//                                 onPress={onPress}
//                                 style={styles.tabItem}
//                             >
//                                 <View style={styles.iconContainer}>
//                                     <View
//                                         style={[
//                                             styles.iconCircle,
//                                             isFocused && {
//                                                 backgroundColor:
//                                                     CookChatColors[scheme]
//                                                         .secondary,
//                                             },
//                                         ]}
//                                     >
//                                         <Icon size={24} color={color} />
//                                     </View>
//                                     {isFocused && (
//                                         <Text
//                                             style={[styles.tabLabel, { color }]}
//                                         >
//                                             {label}
//                                         </Text>
//                                     )}
//                                 </View>
//                             </HapticTab>
//                         );
//                     })}

//                     {/* central “+” button */}
//                     <TouchableOpacity
//                         style={styles.navButton}
//                         onPress={() => navigation.navigate('btn')}
//                     >
//                         <CirclePlus size={26} color="#FFFFFF" />
//                     </TouchableOpacity>
//                 </View>
//             )}
//         >
//             <Tabs.Screen name="index" options={{ title: 'Home' }} />
//             <Tabs.Screen name="recipe" options={{ title: 'Recipes' }} />
//             <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
//             <Tabs.Screen name="Saved" options={{ title: 'Saved' }} />

//             {/* dummy route for the “add” modal */}
//             <Tabs.Screen
//                 name="btn"
//                 options={{
//                     tabBarButton: () => null, // hide its own tab icon
//                     // presentation: 'modal',
//                 }}
//             />
//         </Tabs>
//     );
// }

// const styles = StyleSheet.create({

//     tabBar: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         paddingVertical: 8,
//         borderTopLeftRadius: 25,
//         borderTopRightRadius: 25,
//         shadowColor: '#000',
//         shadowOpacity: 0.15,
//         shadowRadius: 12,
//         shadowOffset: { width: 0, height: -5 },
//         elevation: 15,
//         height: Platform.OS === 'ios' ? 90 : 63,
//     },
//     tabItem: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         flex: 1,
//     },
//     iconContainer: {
//         alignItems: 'center',
//     },
//     iconCircle: {
//         width: 48,
//         height: 48,
//         borderRadius: 24,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: 4,
//     },
//     tabLabel: {
//         fontSize: 12,
//         fontWeight: 'bold',
//     },
//     navButton: {
//         position: 'absolute',
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         backgroundColor: '#FE724C',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginTop: -20,
//         shadowColor: '#FE724C',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 8,
//         elevation: 5,
//     },
// });
import { Tabs, router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
// components
import AddButtonMenu from '@/components/HomeScreenAddBtn';
import CustomTabBar from '@/components/TabCustomBar';

export default function AppLayout() {
    const [showAddMenu, setShowAddMenu] = useState(false);

    const handleAddButtonPress = () => {
        setShowAddMenu(true);
    };

    const handleCloseMenu = () => {
        setShowAddMenu(false);
    };

    const handleNewChatPress = () => {
        // Navigate to new chat screen
        router.push('/screens/FriendListScreen');
        setShowAddMenu(false);
    };

    const handleNewRecipePress = () => {
        // Navigate to new recipe screen
        router.push('/screens/newRecipe');
        setShowAddMenu(false);
    };

    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarStyle: styles.tabBar,
                    tabBarShowLabel: true,
                    tabBarActiveTintColor: '#FE724C',
                    tabBarInactiveTintColor: '#999999',
                    headerShown: false,
                }}
                tabBar={(props) => (
                    <CustomTabBar
                        {...props}
                        handleAddButtonPress={handleAddButtonPress}
                        showAddMenu={showAddMenu}
                        handleNewChatPress={handleNewChatPress}
                        handleNewRecipePress={handleNewRecipePress}
                        handleCloseMenu={handleCloseMenu}
                    />
                )}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="home" size={24} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="discover"
                    options={{
                        title: 'Discover',
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="search" size={24} color={color} />
                        ),
                    }}
                />
                {/* This is a placeholder for the center button - the actual button is rendered in CustomTabBar */}
                <Tabs.Screen
                    name="add-placeholder"
                    options={{
                        title: '',
                        tabBarButton: () => <View style={{ width: 0 }} />,
                    }}
                    listeners={{
                        tabPress: (e) => {
                            // Prevent default navigation
                            e.preventDefault();
                        },
                    }}
                />
                <Tabs.Screen
                    name="chat"
                    options={{
                        title: 'Chat',
                        tabBarIcon: ({ color }) => (
                            <Ionicons
                                name="chatbubble-outline"
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
                
                <Tabs.Screen
                    name="saved"
                    options={{
                        title: 'Saved',
                        tabBarIcon: ({ color }) => (
                            <Ionicons
                                name="bookmark-outline"
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
                
            </Tabs>

            {/* Render add menu if showAddMenu is true */}
            {showAddMenu && (
                <AddButtonMenu
                    onNewChatPress={handleNewChatPress}
                    onNewRecipePress={handleNewRecipePress}
                    onClose={handleCloseMenu}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        display: 'none', // Hide the default tab bar since we're using a custom one
    },
});
