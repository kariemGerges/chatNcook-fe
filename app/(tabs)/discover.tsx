import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import React, { memo, useCallback, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';

import useRecipeScreenFetcher from '@/hooks/useRecipeScreenFetcher';
import { RecipeCard } from '@/components/RecipeCard';
import { Recipe } from '@/assets/types/types';
import { router } from 'expo-router';
import SkeletonLoadingItem from '@/components/SkeletonLoadingItem';
import DiscoverScreenCategories from '@/components/DiscoverScreenCategories';
import { Header } from '@/components/Header';

// Memoized section title component
const SectionTitle = memo(() => (
    <View style={{ paddingBottom: 12 }}>
        <Text style={styles.sectionTitle}></Text>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#777777" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search recipes, chats..."
                    placeholderTextColor="#999999"
                />
            </View>
            <TouchableOpacity style={styles.filterButton}>
                <Ionicons name="options-outline" size={20} color="#333333" />
            </TouchableOpacity>
        </View>
        <DiscoverScreenCategories />
    </View>
));

// Memoized loading indicator component
const LoadingIndicator = memo(() => <ActivityIndicator size="large" />);

// Memoized footer loading component
const ListFooter = memo(({ loading }: { loading: boolean }) =>
    loading ? <SkeletonLoadingItem /> : null
);

// Memoized recipe card wrapper
const MemoizedRecipeCard = memo(({ recipe }: { recipe: Recipe }) => (
    <RecipeCard recipe={recipe} />
));

export default function RecipeScreen() {
    const { recipes, loading, error, refreshing, loadMore, refresh } =
        useRecipeScreenFetcher();

    // Error handling effect
    React.useEffect(() => {
        if (error) {
            Alert.alert('Error', error);
        }
    }, [error]);

    // Memoized render item function
    const renderRecipeItem = useCallback(
        ({ item }: { item: Recipe }) => (
            <TouchableOpacity
                onPress={() =>
                    router.push({
                        pathname: '/screens/singleRecipe',
                        params: { recipeDetail: JSON.stringify(item) },
                    })
                }
            >
                <MemoizedRecipeCard recipe={item} />
            </TouchableOpacity>
        ),
        []
    );

    // Memoized key extractor
    const keyExtractor = useCallback((item: Recipe) => item._id.toString(), []);

    // Memoized list footer component
    const listFooterComponent = useMemo(
        () => <ListFooter loading={loading} />,
        [loading]
    );

    // Memoized getItemLayout for fixed height items
    const getItemLayout = useCallback(
        (data: ArrayLike<Recipe> | null | undefined, index: number) => ({
            length: 150, // Adjust this value to match your actual RecipeCard height
            offset: 150 * index,
            index,
        }),
        []
    );

    // Memoized onEndReached handler with debounce logic
    const handleEndReached = useCallback(() => {
        if (!loading) {
            loadMore();
        }
    }, [loading, loadMore]);

    return (
        <View style={styles.container}>
            <Header />

            {/* Section Title */}
            <SectionTitle />

            <View style={styles.listContainer}>
                {loading && recipes.length === 0 ? (
                    <LoadingIndicator />
                ) : (
                    <FlatList
                        data={recipes}
                        keyExtractor={keyExtractor}
                        renderItem={renderRecipeItem}
                        onEndReached={handleEndReached}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={listFooterComponent}
                        refreshing={refreshing}
                        onRefresh={refresh}
                        contentContainerStyle={styles.flatListContent}
                        getItemLayout={getItemLayout}
                        removeClippedSubviews={true}
                        initialNumToRender={5}
                        maxToRenderPerBatch={10}
                        windowSize={21} // Increased from 5 to 21 (each window is 10 items)
                        updateCellsBatchingPeriod={100} // Increased from 50 to 100ms
                        maintainVisibleContentPosition={{
                            minIndexForVisible: 0,
                            autoscrollToTopThreshold: 10,
                        }}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        padding: 8,
        color: '#333333',
    },
    listContainer: {
        flex: 1,
    },
    flatListContent: {
        paddingHorizontal: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 15,
        color: '#333333',
    },
    filterButton: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginLeft: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
});
