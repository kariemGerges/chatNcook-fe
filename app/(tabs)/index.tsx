import React, { useRef } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, StatusBar, View } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

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
    const sheetRef = useRef<BottomSheet>(null);

    console.log('[FAB] sheetRef:', sheetRef.current);

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
            {/* Floating Action Button */}
            <View style={{ flex: 1 }}>
                <AiPromptSheet ref={sheetRef} />
                <AiFab
                    onPress={() => {
                        console.log('FAB Pressed');
                        sheetRef.current?.expand?.();
                    }}
                />
            </View>
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
