import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Recipe } from '@/assets/types/types';

export const useAddNewRecipe = (recipe: Recipe) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const loadingRef = useRef(false);
    // Reset state when recipe changes
    useEffect(() => {
        setSuccess(false);
        setError(null);
    }, [recipe]);

    const addNewRecipe = useCallback(async () => {
        loadingRef.current = true;
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.post(
                'https://chatncook-be.onrender.com/recipes/addNew',
                recipe
            );
            console.log('Response data:', response.data);
            setLoading(false);
            setError(null);
            setSuccess(true);
            return response.data;
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'An unknown error occurred'
            );
            setLoading(false);
            setSuccess(false);
        }
    }, [recipe]);

    return { loading, error, success, addNewRecipe };
};
