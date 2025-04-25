import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe, apiResponse } from '@/assets/types/types';

const useRecipeScreenFetcher = (): apiResponse => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const loadingRef = useRef<boolean>(false);

    // Fetch recipes
    const fetchRecipes = useCallback(async (pageNum: number, isRefresh = false) => {
        if (loadingRef.current) return;
        
        loadingRef.current = true;
        setLoading(true);
        setError(null);
    
        try {
            const response = await axios.get('https://chatncook-be.onrender.com/recipes/paginate', {
                params: { page: pageNum, limit },
            });
    
            const { data, currentPage, totalPages: total } = response.data;
            
            setRecipes(prev => isRefresh ? data : [...prev, ...data]);
            setPage(currentPage);
            setTotalPages(total);

            if (isRefresh) {
                await AsyncStorage.setItem('@recipes', JSON.stringify(data));
            }
        } catch (err) {
            console.error('Error fetching recipes:', err);
            setError('Failed to load recipes. Please try again later.');
        } finally {
            loadingRef.current = false;
            setLoading(false);
            setRefreshing(false);
        }
    }, [limit]);
    
    // Initialize
    useEffect(() => {
        const initialize = async () => {
            try {
                const storedRecipes = await AsyncStorage.getItem('@recipes');
                if (storedRecipes) {
                    setRecipes(JSON.parse(storedRecipes));
                }
            } catch (e) {
                console.error('Failed to load recipes from storage:', e);
            } finally {
                fetchRecipes(1, true);
            }
        };
        initialize();
    }, [fetchRecipes]);

    const loadMore = useCallback(() => {
        if (page < totalPages && !loadingRef.current) {
            fetchRecipes(page + 1, false);
        }
    }, [page, totalPages, fetchRecipes]);

    const refresh = useCallback(() => {
        setRefreshing(true);
        fetchRecipes(1, true);
    }, [fetchRecipes]);

    return {
        recipes,
        loading,
        error,
        refreshing,
        loadMore,
        refresh,
    };
};

export default useRecipeScreenFetcher;