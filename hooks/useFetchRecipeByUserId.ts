import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe, apiResponseRecipeById } from '@/assets/types/types';

const useRecipeFetcherByUserId = (userId: string): apiResponseRecipeById => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const loadingRef = useRef<boolean>(false);

    const fetchRecipesById = useCallback(
        async (isRefresh = false) => {
            if (loadingRef.current || userId.length === 0) return;

            loadingRef.current = true;
            setLoading(true);
            setError(null);

            try {
                const query = userId
                const response = await axios.get(
                    `https://chatncook-be.onrender.com/recipes/${query}`
                );
                console.log('Response data:', response.data);

                // Check if response.data has the expected structure
                if (response.data && Array.isArray(response.data)) {
                    setRecipes(response.data);

                    if (isRefresh) {
                        await AsyncStorage.setItem(
                            '@recipes',
                            JSON.stringify(response.data)
                        );
                    }
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (error) {
                console.error('Error fetching recipes:', error);
                setError(
                    'Failed to load saved recipes. Please try again later.'
                );
            } finally {
                loadingRef.current = false;
                setLoading(false);
                setRefreshing(false);
            }
        },
        [userId] // Add userId to dependency array
    );

    // Initialize
    useEffect(() => {
        fetchRecipesById(true);
    }, [fetchRecipesById]);

    const refresh = useCallback(() => {
        setRefreshing(true);
        fetchRecipesById(true);
    }, [fetchRecipesById]);

    return {
        recipes,
        loading,
        error,
        refreshing,
        refresh,
    };
};

export default useRecipeFetcherByUserId;
