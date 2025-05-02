import React, { useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { firestore, auth } from '@/firebaseConfig';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

// import components
import { Header } from '@/components/Header';
import HomeScreenRecipeCard from '@/components/HomeScreenRecipeCard';
import HomeScreenRecentRecipeCard from '@/components/HomeScreenRecentRecipeCard';
import HomeScreenRecentChats from '@/components/HomeScreenRecentChats';
import { AiFab } from '@/components/AiFab';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const [isSaved, setIsSaved] = useState(false);

    const [error, setError] = useState<string | null>(null);

    // Toggle saved state for recipes
    const toggleSaved = async (recipeId: string) => {
        try {
            const currentUser = auth.currentUser;

            if (!currentUser) {
                // Prompt user to login
                router.push('/screens/LoginScreen');
                return;
            }

            const userId = currentUser.uid;
            
            const savedRecipeRef = doc(
                firestore,
                'users',
                userId,
                'savedRecipes',
                recipeId
            );

            if (isSaved) {
                // Unsave recipe
                await deleteDoc(savedRecipeRef);
                setIsSaved(false);
            } else {
                // Save recipe with timestamp
                await setDoc(savedRecipeRef, {
                    savedAt: new Date(),
                });
                setIsSaved(true);
            }
        } catch (err) {
            console.error('Error toggling save status:', err);
            setError(
                isSaved ? 'Failed to unsave recipe' : 'Failed to save recipe'
            );
        }
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
                {/* Greeting */}

                {/* Trending Recipes */}
                <HomeScreenRecipeCard toggleSaved={toggleSaved} />

                {/* Active Chats */}
                <HomeScreenRecentChats />

                {/* Recent Recipes */}
                <HomeScreenRecentRecipeCard toggleSaved={toggleSaved} />
                <AiFab />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    greeting: {
        fontSize: 14,
        color: '#777777',
    },
    content: {
        flex: 1,
        paddingTop: 8,
    },
});
