import React, { useState } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';

// import Hooks
import { useToggleSaved } from '@/hooks/useToggleSaved';

// import components
import { Header } from '@/components/Header';
import HomeScreenRecipeCard from '@/components/HomeScreenRecipeCard';
import HomeScreenRecentRecipeCard from '@/components/HomeScreenRecentRecipeCard';
import HomeScreenRecentChats from '@/components/HomeScreenRecentChats';
import { AiFab } from '@/components/AiFab';
import { AiPromptSheet } from '@/components/AiPromptSheet';

export default function HomeScreen() {
    const { toggleSavedRecipe } = useToggleSaved();
    const [isModalVisible, setModalVisible] = useState(false);

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <Header />

            {/* Main Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Trending Recipes */}
                <HomeScreenRecipeCard toggleSaved={toggleSavedRecipe} />

                {/* Active Chats */}
                <HomeScreenRecentChats />

                {/* Recent Recipes */}
                <HomeScreenRecentRecipeCard toggleSaved={toggleSavedRecipe} />
            </ScrollView>

            {/* AI Components*/}
            <AiPromptSheet
                isVisible={isModalVisible}
                onClose={handleCloseModal}
            />
            <AiFab onPress={handleOpenModal} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    content: {
        flex: 1,
        paddingTop: 8,
    },
});