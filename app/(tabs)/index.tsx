import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { firestore, auth } from '@/firebaseConfig';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import useFetchRecipeById from '@/hooks/useFetchRecipeById';

// import components
import { Header } from '@/components/Header';
import HomeScreenRecipeCard from '@/components/HomeScreenRecipeCard';
import HomeScreenRecentRecipeCard from '@/components/HomeScreenRecentRecipeCard';
import HomeScreenRecentChats from '@/components/HomeScreenRecentChats';
import { AiFab } from '@/components/AiFab';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const [isSaved, setIsSaved] = useState(false);

    const [savedRecipes, setSavedRecipes] = useState<{
        [key: string]: boolean;
    }>({});
    const [error, setError] = useState<string | null>(null);

    // Check if recipe is saved on component mount
    useEffect(() => {
        const checkSavedStatus = async (recipeId: string) => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) return;

                const savedRecipeRef = doc(
                    firestore,
                    'users',
                    currentUser.uid,
                    'savedRecipes',
                    recipeId
                );
                const docSnap = await getDoc(savedRecipeRef);
                setSavedRecipes((prev) => ({
                    ...prev,
                    [recipeId]: docSnap.exists(),
                }));
            } catch (err) {
                console.error('Error checking saved status:', err);
            }
        };
        checkSavedStatus('recipeId'); // Replace 'recipeId' with the actual recipe ID you want to check
    }, []);

    const toggleSaved = async (recipeId: string) => {
        try {
            const currentUser = auth.currentUser;

            if (!currentUser) {
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

            const isCurrentlySaved = savedRecipes[recipeId];

            if (isCurrentlySaved) {
                await deleteDoc(savedRecipeRef);
                setSavedRecipes((prev) => ({
                    ...prev,
                    [recipeId]: false,
                }));
            } else {
                await setDoc(savedRecipeRef, {
                    savedAt: new Date(),
                });
                setSavedRecipes((prev) => ({
                    ...prev,
                    [recipeId]: true,
                }));
            }

            // Clear any existing errors
            setError(null);
        } catch (err) {
            console.error('Error toggling save status:', err);
            setError(
                savedRecipes[recipeId]
                    ? 'Failed to unsave recipe'
                    : 'Failed to save recipe'
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
                <HomeScreenRecipeCard toggleSaved={toggleSaved}
                />

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
