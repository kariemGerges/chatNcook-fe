import { useState, useEffect } from 'react';
import { firestore, auth } from '@/firebaseConfig';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { router } from 'expo-router';


export const useToggleSaved = () => {

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

    const toggleSavedRecipe = async (recipeId: string) => {
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
    }

    return { savedRecipes, toggleSavedRecipe };
};