import React, { useState, useEffect } from "react";
import axios from "axios";

interface Recipe {
    _id: string;
    id: number;
    title: string;
    description: string;
    image_url: string;
    ingredients: string[];
    preparation_steps: string;
    preparation_time: string;
    country_of_origin: string;
    author: string;
    tags: string[];
    category: string;
}

interface UseCarouselRecipeResponse {
    recipe: Recipe[] | [];
    loading: boolean;
    error: string | null; // Use string for better error message handling
}

export const useCarouselRecipe = (): UseCarouselRecipeResponse => {
    const [recipe, setRecipe] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            setLoading(true);
            try {
                const response = await axios.get<Recipe[]>('https://chatncook-be.onrender.com/recipes/random');
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
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                setLoading(false);
            }
        };
        fetchRecipe();
    }, []);

    return { recipe, loading, error };
};
