import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Recipe, UseCarouselRecipeResponse } from '../assets/types/types';

export const useCarouselRecipe = (): UseCarouselRecipeResponse => {
    const [recipe, setRecipe] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const loadingRef = useRef<boolean>(false);

    const fetchRecipe = useCallback(async (isRefresh = false) => {
        loadingRef.current = true;
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<Recipe[]>(
                'https://chatncook-be.onrender.com/recipes/random'
            );
            // Verify the data structure matches Recipe[]
            if (Array.isArray(response.data)) {
                setRecipe(response.data);
            } else {
                console.error('Unexpected response format', response.data);
                setRecipe([]); // Fallback to empty array if format is unexpected
            }
            setLoading(false);
            setError(null);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'An unknown error occurred'
            );
            setLoading(false);
        } finally {
            loadingRef.current = false;
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Initialize

    useEffect(() => {
        fetchRecipe(true);
    }, [fetchRecipe]);

    const refresh = useCallback(() => {
        setRefreshing(true);
        fetchRecipe(true);
    }, [fetchRecipe]);

    return { recipe, loading, error, refresh, refreshing };
};
