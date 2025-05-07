// app/favorites.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import {
    ChevronLeft,
    Search,
    Clock,
    Users,
    Bookmark,
    Heart,
    MoreVertical,
    Filter,
    Star,
    Timer,
    ChefHat,
} from 'lucide-react-native';
import { auth } from '@/firebaseConfig';
import { RecipeCard } from '@/components/RecipeCard';
import useRecipeFetcherByUserId from '@/hooks/useFetchRecipeByUserId';

import { Recipe } from '@/assets/types/types';

interface Collection {
    id: string;
    name: string;
    recipeCount: number;
    coverImage: string;
}

type SortOption = 'recent' | 'alphabetical' | 'rating' | 'prepTime';
type FilterOption = 'all' | 'meals' | 'desserts' | 'drinks' | 'snacks';

export default function FavoritesScreen(): React.ReactNode {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'recipes' | 'collections'>(
        'recipes'
    );
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortBy, setSortBy] = useState<SortOption>('recent');
    const [filterBy, setFilterBy] = useState<FilterOption>('all');
    const [showSortMenu, setShowSortMenu] = useState<boolean>(false);
    const [collections, setCollections] = useState<Collection[]>([]);

    const currentUser = auth.currentUser;

    if (!currentUser) {
        return (
            <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateTitle}>Please Login</Text>
                <TouchableOpacity
                    style={styles.exploreButton}
                    onPress={() => router.push('/screens/LoginScreen')}
                >
                    <Text style={styles.exploreButtonText}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const userId = currentUser.uid;

    const {
        recipes,
        recipeCount,
        success,
        loading,
        error,
        refreshing,
        refresh,
    } = useRecipeFetcherByUserId(userId);

    // Filter and sort recipes based on current settings
    const filteredAndSortedRecipes = React.useMemo(() => {
        let result = [...recipes];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (recipe) =>
                    recipe.title.toLowerCase().includes(query) ||
                    recipe.tags.some((tag) =>
                        tag.toLowerCase().includes(query)
                    ) ||
                    recipe.country_of_origin.toLowerCase().includes(query)
            );
        }

        // Apply category filter
        if (filterBy !== 'all') {
            const filterMap: Record<FilterOption, string[]> = {
                all: [],
                meals: ['dinner', 'lunch'],
                desserts: ['dessert', 'sweet'],
                drinks: ['drink', 'beverage', 'cocktail'],
                snacks: ['snack', 'appetizer'],
            };

            if (filterMap[filterBy].length > 0) {
                result = result.filter((recipe) =>
                    recipe.tags.some((tag) => filterMap[filterBy].includes(tag))
                );
            }
        }

        // Apply sorting
        switch (sortBy) {
            case 'alphabetical':
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'rating':
                result.sort((a, b) => b.likes - a.likes);
                break;
            case 'prepTime':
                result.sort(
                    (a, b) =>
                        parseInt(a.preparation_time) -
                        parseInt(b.preparation_time)
                );
                break;
            case 'recent':
            default:
                // result.sort(
                //     (a, b) =>
                //         new Date(b.dateAdded).getTime() -
                //         new Date(a.dateAdded).getTime()
                // );
                break;
        }

        return result;
    }, [recipes, searchQuery, sortBy, filterBy]);

    const filteredCollections = React.useMemo(() => {
        if (!searchQuery) return collections;

        const query = searchQuery.toLowerCase();
        return collections.filter((collection) =>
            collection.name.toLowerCase().includes(query)
        );
    }, [collections, searchQuery]);

    // Toggle recipe bookmark/saved status
    // const toggleSaveRecipe = (recipeId: string) => {
    //     setRecipes((prevRecipes) =>
    //         prevRecipes.map((recipe) =>
    //             recipe.id === recipeId
    //                 ? { ...recipe, saved: !recipe.saved }
    //                 : recipe
    //         )
    //     );

    //     // If recipe is being unsaved, show confirmation
    //     const recipe = recipes.find((r) => r.id === recipeId);
    //     if (recipe?.saved) {
    //         Alert.alert(
    //             'Remove from Favorites',
    //             `"${recipe.title}" will be removed from your favorites.`,
    //             [
    //                 { text: 'Cancel', style: 'cancel' },
    //                 {
    //                     text: 'Remove',
    //                     style: 'destructive',
    //                     onPress: () => {
    //                         // In a real app, you would call an API here
    //                         setRecipes((prevRecipes) =>
    //                             prevRecipes.filter((r) => r.id !== recipeId)
    //                         );
    //                     },
    //                 },
    //             ]
    //         );
    //     }
    // };

    // Delete a collection
    const deleteCollection = (collectionId: string) => {
        const collection = collections.find((c) => c.id === collectionId);

        Alert.alert(
            'Delete Collection',
            `Are you sure you want to delete "${collection?.name}"? This won't delete the recipes inside.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        // In a real app, you would call an API here
                        setCollections((prevCollections) =>
                            prevCollections.filter((c) => c.id !== collectionId)
                        );
                    },
                },
            ]
        );
    };

    // Navigate to recipe details
    const viewRecipeDetails = (Recipe: Recipe) => {
        router.push({
            pathname: '/screens/singleRecipe',
            params: { recipeDetail: JSON.stringify(Recipe) },
        });
    };

    // Navigate to collection details
    const goToCollectionDetails = (collectionId: string) => {
        // In a real app, you would navigate to the collection details screen
        console.log(`Navigate to collection ${collectionId}`);
        // router.push(`/collection/${collectionId}`);
    };

    // Render a recipe card
    const renderRecipeItem = ({ item }: { item: Recipe }) => (
        <TouchableOpacity
            style={styles.recipeCard}
            onPress={() => viewRecipeDetails(item)}
            activeOpacity={0.8}
            key={item._id}
        >
            <RecipeCard recipe={item} />
        </TouchableOpacity>
    );

    // Render a collection card
    const renderCollectionItem = ({ item }: { item: Collection }) => (
        <TouchableOpacity
            style={styles.collectionCard}
            onPress={() => goToCollectionDetails(item.id)}
            activeOpacity={0.8}
        >
            <View
                style={[
                    styles.collectionImageContainer,
                    // { backgroundColor: getColorFromString(item.coverImage) },
                ]}
            >
                <Text style={styles.collectionImageText}>
                    {item.name.charAt(0)}
                </Text>

                <TouchableOpacity
                    style={styles.collectionMenuButton}
                    onPress={() => deleteCollection(item.id)}
                >
                    <MoreVertical size={18} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.collectionInfo}>
                <Text style={styles.collectionTitle} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={styles.collectionCount}>
                    {item.recipeCount} recipes
                </Text>
            </View>
        </TouchableOpacity>
    );

    // Render empty state
    const renderEmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <Bookmark size={64} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No favorites yet</Text>
            <Text style={styles.emptyStateText}>
                Add recipes you love to find them here.
            </Text>
            <TouchableOpacity
                onPress={() => router.push('/screens/newRecipe')}
                style={styles.exploreButton}
            >
                <Text style={styles.exploreButtonText}>Add Recipes</Text>
            </TouchableOpacity>
        </View>
    );

    // Render error state
    const renderErrorState = () => (
        <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateTitle}>Something went wrong</Text>
            <Text style={styles.emptyStateText}>Please try again later.</Text>
            <TouchableOpacity style={styles.exploreButton}>
                <Text style={styles.exploreButtonText}>Retry</Text>
            </TouchableOpacity>
        </View>
    );

    if (error && !success && !loading) {
        return renderErrorState();
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <ChevronLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Recipes</Text>
            </View>

            {/* Search & Filter Section */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Search size={18} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search your favorites..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            style={styles.clearSearchButton}
                            onPress={() => setSearchQuery('')}
                        >
                            <Text style={styles.clearSearchText}>×</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setShowSortMenu(!showSortMenu)}
                    >
                        <Filter size={16} color="#555" />
                        <Text style={styles.filterButtonText}>
                            {sortBy === 'recent'
                                ? 'Recent'
                                : sortBy === 'alphabetical'
                                ? 'A-Z'
                                : sortBy === 'rating'
                                ? 'Top Rated'
                                : 'Quick'}
                        </Text>
                    </TouchableOpacity>

                    {showSortMenu && (
                        <View style={styles.sortMenuContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.sortOption,
                                    sortBy === 'recent' &&
                                        styles.activeSortOption,
                                ]}
                                onPress={() => {
                                    setSortBy('recent');
                                    setShowSortMenu(false);
                                }}
                            >
                                <Clock
                                    size={16}
                                    color={
                                        sortBy === 'recent' ? '#FF6B6B' : '#555'
                                    }
                                />
                                <Text
                                    style={[
                                        styles.sortOptionText,
                                        sortBy === 'recent' &&
                                            styles.activeSortOptionText,
                                    ]}
                                >
                                    Recent
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.sortOption,
                                    sortBy === 'alphabetical' &&
                                        styles.activeSortOption,
                                ]}
                                onPress={() => {
                                    setSortBy('alphabetical');
                                    setShowSortMenu(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.sortOptionIcon,
                                        sortBy === 'alphabetical' &&
                                            styles.activeSortOptionText,
                                    ]}
                                >
                                    A-Z
                                </Text>
                                <Text
                                    style={[
                                        styles.sortOptionText,
                                        sortBy === 'alphabetical' &&
                                            styles.activeSortOptionText,
                                    ]}
                                >
                                    Alphabetical
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.sortOption,
                                    sortBy === 'rating' &&
                                        styles.activeSortOption,
                                ]}
                                onPress={() => {
                                    setSortBy('rating');
                                    setShowSortMenu(false);
                                }}
                            >
                                <Star
                                    size={16}
                                    color={
                                        sortBy === 'rating' ? '#FF6B6B' : '#555'
                                    }
                                />
                                <Text
                                    style={[
                                        styles.sortOptionText,
                                        sortBy === 'rating' &&
                                            styles.activeSortOptionText,
                                    ]}
                                >
                                    Top Rated
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.sortOption,
                                    sortBy === 'prepTime' &&
                                        styles.activeSortOption,
                                ]}
                                onPress={() => {
                                    setSortBy('prepTime');
                                    setShowSortMenu(false);
                                }}
                            >
                                <Timer
                                    size={16}
                                    color={
                                        sortBy === 'prepTime'
                                            ? '#FF6B6B'
                                            : '#555'
                                    }
                                />
                                <Text
                                    style={[
                                        styles.sortOptionText,
                                        sortBy === 'prepTime' &&
                                            styles.activeSortOptionText,
                                    ]}
                                >
                                    Quick First
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            {/* Content Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'recipes' && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab('recipes')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'recipes' && styles.activeTabText,
                        ]}
                    >
                        Recipes{' '}
                        {recipeCount > 0
                            ? `(${recipeCount})`
                            : ``
                        }
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'collections' && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab('collections')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'collections' && styles.activeTabText,
                        ]}
                    >
                        Collections
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF6B6B" />
                    <Text style={styles.loadingText}>
                        Loading your favorites...
                    </Text>
                </View>
            ) : (
                <>
                    {activeTab === 'recipes' &&
                        (filteredAndSortedRecipes.length > 0 ? (
                            <FlatList
                                data={filteredAndSortedRecipes as Recipe[]}
                                renderItem={renderRecipeItem}
                                keyExtractor={(item) => item._id}
                                contentContainerStyle={styles.recipesList}
                                showsVerticalScrollIndicator={false}
                                onRefresh={refresh}
                                refreshing={refreshing}
                            />
                        ) : (
                            renderEmptyState()
                        ))}

                    {activeTab === 'collections' &&
                        (filteredCollections.length > 0 ? (
                            <FlatList
                                data={filteredCollections}
                                renderItem={renderCollectionItem}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={styles.collectionsList}
                                numColumns={2}
                                showsVerticalScrollIndicator={false}
                            />
                        ) : (
                            renderEmptyState()
                        ))}
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 12,
        color: '#333',
    },
    searchContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f3f5',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 40,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        paddingVertical: 8,
    },
    clearSearchButton: {
        padding: 4,
    },
    clearSearchText: {
        fontSize: 20,
        color: '#999',
        fontWeight: '600',
    },
    filterContainer: {
        flexDirection: 'row',
        marginTop: 12,
        position: 'relative',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f3f5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    filterButtonText: {
        fontSize: 13,
        color: '#555',
        marginLeft: 4,
        fontWeight: '500',
    },
    sortMenuContainer: {
        position: 'absolute',
        top: 36,
        left: 0,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        padding: 8,
        zIndex: 10,
        minWidth: 160,
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    activeSortOption: {
        backgroundColor: '#fff0f0',
    },
    sortOptionIcon: {
        fontSize: 14,
        fontWeight: '700',
        width: 16,
        textAlign: 'center',
        color: '#555',
    },
    sortOptionText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 8,
    },
    activeSortOptionText: {
        color: '#FF6B6B',
        fontWeight: '600',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    tab: {
        paddingVertical: 12,
        marginRight: 24,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#FF6B6B',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#888',
    },
    activeTabText: {
        color: '#FF6B6B',
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    recipesList: {
        padding: 16,
    },
    recipeCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    recipeImageContainer: {
        height: 180,
        width: '100%',
        position: 'relative',
    },
    recipePlaceholderImage: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookmarkButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    difficultyLabel: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    easyLabel: {
        backgroundColor: 'rgba(76, 175, 80, 0.9)',
    },
    mediumLabel: {
        backgroundColor: 'rgba(255, 193, 7, 0.9)',
    },
    hardLabel: {
        backgroundColor: 'rgba(244, 67, 54, 0.9)',
    },
    difficultyText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    recipeInfo: {
        padding: 12,
    },
    recipeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    recipeMetaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    chefContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chefAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#4ECDC4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
    },
    chefAvatarText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    chefName: {
        fontSize: 13,
        color: '#666',
        maxWidth: 120,
    },
    statsContainer: {
        flexDirection: 'row',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    statText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 4,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tagItem: {
        backgroundColor: '#f1f3f5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
    },
    tagText: {
        fontSize: 12,
        color: '#666',
    },
    moreTagsText: {
        fontSize: 12,
        color: '#999',
        alignSelf: 'center',
    },
    collectionsList: {
        padding: 16,
    },
    collectionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
        flex: 1,
        marginRight: 8,
    },
    collectionImageContainer: {
        height: 180,
        width: '100%',
        position: 'relative',
    },
    collectionPlaceholderImage: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    collectionBookmarkButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    collectionInfo: {
        padding: 12,
    },
    collectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    collectionMetaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    collectionChefContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    collectionChefAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#4ECDC4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
    },
    collectionChefAvatarText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    collectionChefName: {
        fontSize: 13,
        color: '#666',
        maxWidth: 120,
    },
    collectionStatsContainer: {
        flexDirection: 'row',
    },
    collectionStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    collectionStatText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 4,
    },
    collectionTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    collectionTagItem: {
        backgroundColor: '#f1f3f5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
    },
    collectionTagText: {
        fontSize: 12,
        color: '#666',
    },
    collectionMoreTagsText: {
        fontSize: 12,
        color: '#999',
        alignSelf: 'center',
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 12,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
    },
    exploreButton: {
        marginTop: 16,
        backgroundColor: '#FF6B6B',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    exploreButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    collectionImageText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
    },
    collectionMenuButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    collectionCount: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
});
