import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Image,
    ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '@/firebaseConfig';
import { useAddNewRecipe } from '@/hooks/useAddNewRecipe';

// import types
import {
    Recipe,
    RecipeCategory,
    AddNewRecipeScreenProps,
} from '@/assets/types/types';

const AddNewRecipeScreen: React.FC<AddNewRecipeScreenProps> = () => {
    // Router and auth setup
    const router = useRouter();
    const currentUser = auth.currentUser;

    // Recipe form state
    const [recipeForm, setRecipeForm] = useState({
        title: '',
        description: '',
        imageUrl: '',
        ingredients: '',
        preparationSteps: '',
        preparationTime: '',
        countryOfOrigin: '',
        tags: '',
        category: '',
    });

    // UI state
    const [showCategories, setShowCategories] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    // Categories for selection
    const categories: RecipeCategory[] = [
        'Appetizer',
        'Main Course',
        'Dessert',
        'Breakfast',
        'Lunch',
        'Dinner',
        'Snack',
        'Drink',
    ];

    // Custom hook for adding recipes
    const {
        loading: newRecipeLoading,
        error: newRecipeError,
        success,
        addNewRecipe,
    } = useAddNewRecipe();

    // Check authentication on mount
    useEffect(() => {
        if (!currentUser) {
            setAuthError('You must be logged in to add recipes');
        }
    }, [currentUser]);

    // Handle form input changes
    const handleInputChange = (field: string, value: string) => {
        setRecipeForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error for this field if it exists
        if (formErrors[field]) {
            setFormErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Select a category
    const selectCategory = (selectedCategory: RecipeCategory): void => {
        handleInputChange('category', selectedCategory);
        setShowCategories(false);
    };

    // Validate form before submission
    const validateForm = () => {
        const errors: { [key: string]: string } = {};
        const requiredFields: Array<{ key: keyof typeof recipeForm; label: string }> = [
            { key: 'title', label: 'Recipe title' },
            { key: 'description', label: 'Description' },
            { key: 'ingredients', label: 'Ingredients' },
            { key: 'preparationSteps', label: 'Preparation steps' },
            { key: 'preparationTime', label: 'Preparation time' },
            { key: 'countryOfOrigin', label: 'Country of origin' },
            { key: 'tags', label: 'Tags' },
            { key: 'category', label: 'Category' },
        ];

        // Check required fields
        requiredFields.forEach((field) => {
            if (!recipeForm[field.key].trim()) {
                errors[field.key] = `${field.label} is required`;
            }
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (): Promise<void> => {
        // Validate form
        if (!validateForm()) {
            Alert.alert(
                'Missing Information',
                'Please fill in all required fields'
            );
            return;
        }

        // Check authentication
        if (!currentUser) {
            Alert.alert('Error', 'You must be logged in to add recipes');
            return;
        }

        try {
            // Create recipe object
            const newRecipe: Recipe = {
                id: Math.floor(1000 + Math.random() * 900), // Generate random ID
                title: recipeForm.title,
                description: recipeForm.description,
                image_url: recipeForm.imageUrl,
                ingredients: recipeForm.ingredients
                    .split(',')
                    .map((item) => item.trim()),
                preparation_steps: recipeForm.preparationSteps,
                preparation_time: recipeForm.preparationTime,
                country_of_origin: recipeForm.countryOfOrigin,
                author: currentUser.uid,
                tags: recipeForm.tags.split(',').map((tag) => tag.trim()),
                category: recipeForm.category as RecipeCategory,
                likes: 0,
                saved: false,
                chefAvatar: '',
            };

            // console.log('Recipe from new recipe screen', newRecipe);

            // Add recipe
            await addNewRecipe(newRecipe);
        } catch (error) {
            console.error('Error in handleSubmit:', error);
        }
    };

    // Handle successful recipe addition
    useEffect(() => {
        if (success === true) {
        
            Alert.alert(
                'Recipe Added!',
                `${recipeForm.title} has been added to your recipes`,
                [{ text: 'OK', onPress: () => router.push('/(tabs)/discover') }]
            );
        }
    }, [success, recipeForm.title, router]);

    // Render loading state
    if (newRecipeLoading) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="#FF6B6B" />
                <Text style={styles.loadingText}>Adding your recipe...</Text>
            </View>
        );
    }

    // Render error state
    if (authError) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.errorText}>{authError}</Text>
                <TouchableOpacity
                    style={styles.errorButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.errorButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Main render
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Recipe</Text>
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={styles.saveButton}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>

            {/* Error Banner */}
            {newRecipeError && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>{newRecipeError}</Text>
                </View>
            )}

            <ScrollView style={styles.formContainer}>
                {/* Recipe Image */}
                <View style={styles.imageContainer}>
                    {recipeForm.imageUrl ? (
                        <Image
                            source={{ uri: recipeForm.imageUrl }}
                            style={styles.recipeImage}
                        />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="camera" size={40} color="#ccc" />
                            <Text style={styles.imagePlaceholderText}>
                                Add Photo
                            </Text>
                        </View>
                    )}
                    <TextInput
                        style={styles.imageUrlInput}
                        placeholder="Enter image URL"
                        value={recipeForm.imageUrl}
                        onChangeText={(value) =>
                            handleInputChange('imageUrl', value)
                        }
                    />
                </View>

                {/* Title */}
                <FormField
                    label="Recipe Title*"
                    placeholder="Enter recipe name"
                    value={recipeForm.title}
                    onChangeText={(value) => handleInputChange('title', value)}
                    error={formErrors.title}
                />

                {/* Description */}
                <FormField
                    label="Description*"
                    placeholder="Describe your recipe"
                    value={recipeForm.description}
                    onChangeText={(value) =>
                        handleInputChange('description', value)
                    }
                    multiline
                    textArea
                    error={formErrors.description}
                />

                {/* Ingredients */}
                <FormField
                    label="Ingredients* (comma separated)"
                    placeholder="E.g., rice, lentils, pasta, salsa"
                    value={recipeForm.ingredients}
                    onChangeText={(value) =>
                        handleInputChange('ingredients', value)
                    }
                    multiline
                    textArea
                    error={formErrors.ingredients}
                />

                {/* Preparation Steps */}
                <FormField
                    label="Preparation Steps*"
                    placeholder="Step-by-step instructions"
                    value={recipeForm.preparationSteps}
                    onChangeText={(value) =>
                        handleInputChange('preparationSteps', value)
                    }
                    multiline
                    textArea
                    error={formErrors.preparationSteps}
                />

                {/* Preparation Time */}
                <FormField
                    label="Preparation Time*"
                    placeholder="E.g., 30 minutes"
                    value={recipeForm.preparationTime}
                    onChangeText={(value) =>
                        handleInputChange('preparationTime', value)
                    }
                    error={formErrors.preparationTime}
                />

                {/* Country of Origin */}
                <FormField
                    label="Country of Origin*"
                    placeholder="E.g., Egypt"
                    value={recipeForm.countryOfOrigin}
                    onChangeText={(value) =>
                        handleInputChange('countryOfOrigin', value)
                    }
                    error={formErrors.countryOfOrigin}
                />

                {/* Tags */}
                <FormField
                    label="Tags* (comma separated)"
                    placeholder="E.g., breakfast, healthy, vegan"
                    value={recipeForm.tags}
                    onChangeText={(value) => handleInputChange('tags', value)}
                    error={formErrors.tags}
                />

                {/* Category Dropdown */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category*</Text>
                    <TouchableOpacity
                        style={[
                            styles.dropdownButton,
                            formErrors.category && styles.inputError,
                        ]}
                        onPress={() => setShowCategories(!showCategories)}
                    >
                        <Text style={styles.dropdownButtonText}>
                            {recipeForm.category || 'Select Category'}
                        </Text>
                        <Ionicons
                            name={
                                showCategories ? 'chevron-up' : 'chevron-down'
                            }
                            size={24}
                            color="#555"
                        />
                    </TouchableOpacity>
                    {formErrors.category && (
                        <Text style={styles.errorText}>
                            {formErrors.category}
                        </Text>
                    )}

                    {showCategories && (
                        <View style={styles.categoryDropdown}>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={styles.categoryItem}
                                    onPress={() => selectCategory(cat)}
                                >
                                    <Text style={styles.categoryItemText}>
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Submit Button */}
                <View style={styles.submitButtonContainer}>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        disabled={newRecipeLoading}
                    >
                        <Text style={styles.submitButtonText}>
                            {newRecipeLoading ? 'Creating...' : 'Create Recipe'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Footer Note */}
                <View style={styles.footer}>
                    <Text style={styles.requiredFieldsNote}>
                        * Required fields
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

// Form Field Component with error handling
interface FormFieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    multiline?: boolean;
    textArea?: boolean;
    error?: string | null;
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    multiline = false,
    textArea = false,
    error = null,
}) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={[
                styles.input,
                textArea && styles.textArea,
                error && styles.inputError,
            ]}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            multiline={multiline}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    errorText: {
        fontSize: 12,
        color: '#d32f2f',
        marginTop: 4,
    },
    errorBanner: {
        backgroundColor: '#ffebee',
        padding: 10,
        borderRadius: 5,
        margin: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#d32f2f',
    },
    errorBannerText: {
        color: '#d32f2f',
        fontSize: 14,
    },
    inputError: {
        borderColor: '#d32f2f',
    },
    errorButton: {
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    errorButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FF6B6B',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    saveButtonText: {
        color: '#FF6B6B',
        fontWeight: 'bold',
    },
    formContainer: {
        flex: 1,
        padding: 20,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 25,
    },
    recipeImage: {
        width: '100%',
        height: 200,
        borderRadius: 15,
    },
    imagePlaceholder: {
        width: '100%',
        height: 200,
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
    },
    imagePlaceholderText: {
        color: '#999',
        marginTop: 10,
    },
    imageUrlInput: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 12,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    dropdownButtonText: {
        fontSize: 16,
        color: '#555',
    },
    categoryDropdown: {
        backgroundColor: 'white',
        marginTop: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    categoryItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    categoryItemText: {
        fontSize: 16,
        color: '#333',
    },
    submitButtonContainer: {
        marginTop: 10,
        marginBottom: 30,
    },
    submitButton: {
        backgroundColor: '#FF6B6B',
        borderRadius: 10,
        padding: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    requiredFieldsNote: {
        color: '#777',
        fontSize: 14,
    },
});

export default AddNewRecipeScreen;
