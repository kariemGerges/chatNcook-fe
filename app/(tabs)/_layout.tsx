import { Tabs, router } from 'expo-router';
import { StyleSheet } from 'react-native';
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

    // Handle friend list press
    const handleNewFriendPress = () => {
        // Navigate to new friend screen
        router.push('/screens/FriendListScreen');
        setShowAddMenu(false);
    };

    // handle help press
    const handleHelpPress = () => {
        // Navigate to help screen
        router.push('/screens/HelpScreen');
        setShowAddMenu(false);
    };
    // handle settings press
    const handleSettingsPress = () => {
        // Navigate to settings screen
        router.push('/screens/SettingsScreen');
        setShowAddMenu(false);
    };

    // handle Favorites press
    const handleFavoritesPress = () => {
        // Navigate to favorites screen
        router.push('/screens/FavScreen');
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
                {/* <Tabs.Screen
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
                /> */}
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
                    onNewFriendPress={handleNewFriendPress}
                    onHelpPress={handleHelpPress}
                    onSettingsPress={handleSettingsPress}
                    onFavPress={handleFavoritesPress}
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
