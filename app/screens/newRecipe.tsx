import React, { useState } from 'react';
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
// import { StackNavigationProp } from '@react-navigation/stack';

const AddNewRecipeScreen: React.FC<AddNewRecipeScreenProps> = ({}) => {
    // State for all recipe fields
    const router = useRouter();

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>('');
    const [ingredients, setIngredients] = useState<string>('');
    const [preparationSteps, setPreparationSteps] = useState<string>('');
    const [preparationTime, setPreparationTime] = useState<string>('');
    const [countryOfOrigin, setCountryOfOrigin] = useState<string>('');
    const [tags, setTags] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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
    const [showCategories, setShowCategories] = useState<boolean>(false);

    // get user id from firebase auth
    const currentUser = auth.currentUser;

    if (!currentUser) {
        setError('You must be logged in to view saved recipes');
        setLoading(false);
        return;
    }

    const userId = currentUser.uid;

    // Handle form submission
    const handleSubmit = (): void => {
        // Validation
        if (
            !title.trim() ||
            !description.trim() ||
            !ingredients.trim() ||
            !preparationSteps.trim() ||
            !preparationTime.trim() ||
            !countryOfOrigin.trim() ||
            !tags.trim() ||
            !category.trim()
        ) {
            Alert.alert(
                'Missing Information',
                'Please fill in all required fields'
            );
            return;
        }

        // Create recipe object
        const newRecipe: Recipe = {
            id: Math.floor(1000 + Math.random() * 9000), // Generate random ID
            title: title,
            description: description,
            image_url: imageUrl,
            ingredients: ingredients.split(',').map((item) => item.trim()),
            preparation_steps: preparationSteps,
            preparation_time: preparationTime,
            country_of_origin: countryOfOrigin,
            author: userId,
            tags: tags.split(',').map((tag) => tag.trim()),
            category: category,
            likes: 0,
            saved: false,
            chefAvatar: '',
        };

        const { loading, error, success, addNewRecipe } =
            useAddNewRecipe(newRecipe);

        // Here you would normally send this data to your backend/API
        console.log('New Recipe:', newRecipe);

        // Show success message
        if (success === true) {
            Alert.alert(
                'Recipe Added!',
                `${title} has been added to your recipes`,
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } else if (error) {
            Alert.alert('Error', error);
        }
    };

    // Function to select a category
    const selectCategory = (selectedCategory: RecipeCategory): void => {
        setCategory(selectedCategory);
        setShowCategories(false);
    };

    // user not logged in error handling
    if (error) {
        return (
            <View>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.header}>
                {/* Back button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                {/* Header title and save button */}
                <Text style={styles.headerTitle}>Add New Recipe</Text>
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={styles.saveButton}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
                {/* Recipe Image Placeholder */}
                <View style={styles.imageContainer}>
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
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
                        value={imageUrl}
                        onChangeText={setImageUrl}
                    />
                </View>

                {/* Title */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Recipe Title*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter recipe name"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Description */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description*</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Describe your recipe"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />
                </View>

                {/* Ingredients */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        Ingredients* (comma separated)
                    </Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="E.g., rice, lentils, pasta, salsa"
                        value={ingredients}
                        onChangeText={setIngredients}
                        multiline
                    />
                </View>

                {/* Preparation Steps */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Preparation Steps*</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Step-by-step instructions"
                        value={preparationSteps}
                        onChangeText={setPreparationSteps}
                        multiline
                    />
                </View>

                {/* Preparation Time */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Preparation Time</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="E.g., 30 minutes"
                        value={preparationTime}
                        onChangeText={setPreparationTime}
                    />
                </View>

                {/* Country of Origin */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Country of Origin</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="E.g., Egypt"
                        value={countryOfOrigin}
                        onChangeText={setCountryOfOrigin}
                    />
                </View>

                {/* Tags */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tags (comma separated)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="E.g., breakfast, healthy, vegan"
                        value={tags}
                        onChangeText={setTags}
                    />
                </View>

                {/* Category Dropdown */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category</Text>
                    <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setShowCategories(!showCategories)}
                    >
                        <Text style={styles.dropdownButtonText}>
                            {category || 'Select Category'}
                        </Text>
                        <Ionicons
                            name={
                                showCategories ? 'chevron-up' : 'chevron-down'
                            }
                            size={24}
                            color="#555"
                        />
                    </TouchableOpacity>

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
                    >
                        <Text style={styles.submitButtonText}>
                            Create Recipe
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
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
