// app/saved.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { firestore, auth } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import useFetchRecipeById from '@/hooks/useFetchRecipeById';
import { Recipe } from '@/assets/types/types';

export default function SavedRecipesScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [isInitialFetch, setIsInitialFetch] = useState(true);

    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [error, setError] = useState<string | null>(null);

    // Filter categories
    const filters = ['All', 'Italian', 'Quick', 'Vegetarian', 'Recent'];

    // Fetch saved recipes from Firestore
    const [recipeIds, setRecipeIds] = useState<number[]>([]);
    const {
        recipes,
        loading: recipeLoading,
        error: recipeError,
        refreshing,
        refresh,
    } = useFetchRecipeById(isInitialFetch ? [] : recipeIds);

    console.log('recipeIds:', recipeIds);
    console.log('recipes from saved:', recipes);
    console.log('recipeLoading:', recipeLoading, 'refreshing:', refreshing);
    console.log('recipeError:', recipeError);

    // First useEffect to fetch saved recipe IDs
    useEffect(() => {
        const fetchSavedRecipes = async () => {
            try {
                setLoading(true);
                const currentUser = auth.currentUser;

                if (!currentUser) {
                    setError('You must be logged in to view saved recipes');
                    setLoading(false);
                    return;
                }

                const userId = currentUser.uid;
                const savedRef = collection(
                    firestore,
                    'users',
                    userId,
                    'savedRecipes'
                );

                const savedSnap = await getDocs(savedRef);
                const newRecipeIds = savedSnap.docs.map((doc) =>
                    Number(doc.id)
                );

                setRecipeIds(newRecipeIds);
                setIsInitialFetch(false);
            } catch (err) {
                console.error('Error fetching saved recipes:', err);
                setError('Failed to load saved recipes');
            } finally {
                setLoading(false);
            }
        };

        fetchSavedRecipes();
    }, [auth.currentUser?.uid]);

    // Remove recipe from saved collection
    const unsaveRecipe = async (recipeId: number) => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            const userId = currentUser.uid;
            const savedRecipeRef = doc(
                firestore,
                'users',
                userId,
                'savedRecipes',
                recipeId.toString()
            );

            await deleteDoc(savedRecipeRef);

            // Update local state
            setSavedRecipes((prevRecipes) =>
                prevRecipes.filter((recipe) => recipe.id !== recipeId)
            );
        } catch (err) {
            console.error('Error removing saved recipe:', err);
            setError('Failed to remove recipe from saved list');
        }
    };

    // Navigate to recipe details
    const viewRecipeDetails = (recipeId: number) => {
        router.push({
            pathname: '/screens/singleRecipe',
            params: { recipeDetail: JSON.stringify(recipeId) },
        });
    };

    // Filter recipes based on active filter
    const getFilteredRecipes = () => {
        if (activeFilter === 'All') return recipes;
        if (activeFilter === 'Recent') {
            return (
                [...recipes]
                    // .sort((a, b) => b.createdAt - a.createdAt)
                    .slice(0, 5)
            );
        }

        return recipes.filter((recipe) => {
            const lowerFilter = activeFilter.toLowerCase();
            return recipe.tags.includes(lowerFilter);
        });
    };

    // Render a recipe card
    const renderRecipeCard = ({ item }: { item: Recipe }) => (
        <TouchableOpacity
            style={styles.recipeCard}
            onPress={() => viewRecipeDetails(item.id)}
        >
            <Image
                source={
                    item.image_url
                        ? { uri: item.image_url }
                        : require('@/assets/images/sginup.webp')
                }
                style={styles.recipeImage}
                defaultSource={require('@/assets/images/sginup.webp')}
            />

            <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.recipeAuthor}>by {item.author}</Text>

                <View style={styles.recipeMetaContainer}>
                    <View style={styles.prepTimeContainer}>
                        <Ionicons name="time-outline" size={14} color="#666" />
                        <Text style={styles.prepTime}>
                            {item.preparation_time}
                        </Text>
                    </View>

                    <View style={styles.tagContainer}>
                        {item.tags.slice(0, 2).map((tag, index) => (
                            <View key={index} style={styles.tagBadge}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            <View style={styles.recipeActions}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => unsaveRecipe(item.id)}
                >
                    <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    // Render filter chips
    const renderFilterChip = (filter: string) => (
        <TouchableOpacity
            key={filter}
            style={[
                styles.filterChip,
                activeFilter === filter && styles.activeFilterChip,
            ]}
            onPress={() => setActiveFilter(filter)}
        >
            <Text
                style={[
                    styles.filterChipText,
                    activeFilter === filter && styles.activeFilterChipText,
                ]}
            >
                {filter}
            </Text>
        </TouchableOpacity>
    );

    // Show loading state
    if (loading || recipeLoading) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#FE724C" />
                <Text style={styles.loadingText}>
                    Loading your saved recipes...
                </Text>
            </SafeAreaView>
        );
    }

    // Show loading state
    if (loading || (recipeLoading && !isInitialFetch)) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#FE724C" />
                <Text style={styles.loadingText}>
                    Loading your saved recipes...
                </Text>
            </SafeAreaView>
        );
    }

    // Show error state
    if (error) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <Ionicons
                    name="alert-circle-outline"
                    size={64}
                    color="#FF3B30"
                />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => {
                        setError(null);
                        setLoading(true);
                        // Re-fetch data (would typically call the fetch function here)
                    }}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Saved Recipes</Text>
                <TouchableOpacity>
                    <Ionicons name="options-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Filter chips */}
            <View style={styles.filterContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={filters}
                    renderItem={({ item }) => renderFilterChip(item)}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.filterList}
                />
            </View>

            {/* Recipe list */}
            {recipes ? (
                <FlatList
                    // data={getFilteredRecipes()}
                    data={recipes}
                    renderItem={renderRecipeCard}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.recipeList}
                />
            ) : (
                <View style={styles.emptyStateContainer}>
                    <Ionicons
                        name="bookmark-outline"
                        size={80}
                        color="#CCCCCC"
                    />
                    <Text style={styles.emptyStateText}>
                        No saved recipes found
                    </Text>
                    <Text style={styles.emptyStateSubtext}>
                        Recipes you save will appear here
                    </Text>
                    <TouchableOpacity
                        style={styles.discoverButton}
                        onPress={() => router.push('/discover')}
                    >
                        <Text style={styles.discoverButtonText}>
                            Discover Recipes
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666666',
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 16,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#FE724C',
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333333',
    },
    filterContainer: {
        backgroundColor: '#FFFFFF',
        paddingBottom: 12,
    },
    filterList: {
        paddingHorizontal: 16,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        marginRight: 8,
    },
    activeFilterChip: {
        backgroundColor: '#FE724C',
    },
    filterChipText: {
        fontSize: 14,
        color: '#666666',
    },
    activeFilterChipText: {
        color: '#FFFFFF',
        fontWeight: '500',
    },
    recipeList: {
        padding: 16,
    },
    recipeCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    recipeImage: {
        width: 90,
        height: 90,
        borderRadius: 8,
        margin: 12,
    },
    recipeInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    recipeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
    },
    recipeAuthor: {
        fontSize: 13,
        color: '#666666',
        marginBottom: 8,
    },
    recipeMetaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    prepTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    prepTime: {
        fontSize: 12,
        color: '#666666',
        marginLeft: 4,
    },
    tagContainer: {
        flexDirection: 'row',
    },
    tagBadge: {
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 4,
    },
    tagText: {
        fontSize: 10,
        color: '#666666',
    },
    recipeActions: {
        padding: 12,
        justifyContent: 'center',
    },
    iconButton: {
        padding: 4,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666666',
        marginTop: 16,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#999999',
        textAlign: 'center',
        marginTop: 8,
    },
    discoverButton: {
        marginTop: 24,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#FE724C',
        borderRadius: 8,
    },
    discoverButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});
