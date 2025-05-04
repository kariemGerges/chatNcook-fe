import { useState, useCallback } from 'react';
import axios from 'axios';
import { Recipe } from '@/assets/types/types';

/**
 * Custom hook for adding a new recipe to the backend
 */
export const useAddNewRecipe = () => {
    // State management for the API call
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [responseData, setResponseData] = useState(null);

    /**
     * Function to add a new recipe
     * @param recipe The recipe object to add
     * @returns The response data if successful
     */
    const addNewRecipe = useCallback(async (recipe: Recipe) => {
        // Reset states
        setLoading(true);
        setError(null);
        setSuccess(false);
        setResponseData(null);

        try {
            // console.log('Adding new recipe:', JSON.stringify(recipe, null, 2));

            // Create a request config with more detailed headers
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            };

            // Validate recipe object structure before sending
            const validatedRecipe = {
                ...recipe,
                // Ensure ingredients is an array
                ingredients: Array.isArray(recipe.ingredients)
                    ? recipe.ingredients
                    : typeof recipe.ingredients === 'string'
                    ? recipe.ingredients.split(',').map((item) => item.trim())
                    : [],
                // Make sure these fields exist and are of correct type
                preparation_time: recipe.preparation_time || '',
                country_of_origin: recipe.country_of_origin || '',
                tags: Array.isArray(recipe.tags)
                    ? recipe.tags
                    : typeof recipe.tags === 'string'
                    ? recipe.tags.split(',').map((tag) => tag.trim())
                    : [],
                likes: recipe.likes || 0,
                saved: recipe.saved || false,
            };

            const response = await axios.post(
                'https://chatncook-be.onrender.com/recipes/addNew',
                validatedRecipe,
                config
            );

            // console.log('Recipe added successfully:', response.data);

            // Update states
            setResponseData(response.data);
            setSuccess(true);
            return response.data;
        } catch (err) {
            // Handle error with more detailed information
            let errorMessage = 'Failed to add recipe. Please try again.';

            if (axios.isAxiosError(err)) {
                // This is an Axios error
                if (err.response) {
                    // The server responded with a status code outside of 2xx range
                    console.error('Server response error:', err.response.data);
                    console.error('Status code:', err.response.status);

                    // Extract more specific error information if available
                    if (
                        err.response.data &&
                        typeof err.response.data === 'object'
                    ) {
                        errorMessage =
                            err.response.data.message ||
                            err.response.data.error ||
                            errorMessage;
                    } else if (typeof err.response.data === 'string') {
                        errorMessage = err.response.data;
                    }

                    // Specific handling for common status codes
                    if (err.response.status === 400) {
                        errorMessage =
                            'Invalid recipe data. Please check your inputs.';
                    } else if (err.response.status === 401) {
                        errorMessage =
                            'Authentication required. Please log in again.';
                    } else if (err.response.status === 500) {
                        errorMessage =
                            'Server error occurred. The recipe format may be incorrect.';
                    }
                } else if (err.request) {
                    // The request was made but no response was received
                    console.error('No response received:', err.request);
                    errorMessage =
                        'No response from server. Please check your connection.';
                } else {
                    // Something happened in setting up the request
                    console.error('Request setup error:', err.message);
                    errorMessage = `Request error: ${err.message}`;
                }
            } else if (err instanceof Error) {
                console.error('Non-axios error:', err.message);
                errorMessage = err.message;
            }

            setError(errorMessage);
            return null;
        } finally {
            // Always set loading to false when done
            setLoading(false);
        }
    }, []);

    return { loading, error, success, responseData, addNewRecipe };
};
