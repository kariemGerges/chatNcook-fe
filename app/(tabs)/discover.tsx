import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from 'react-native';
import React, { memo, useCallback, useMemo } from 'react';
import useRecipeScreenFetcher from '@/hooks/useRecipeScreenFetcher';
import { RecipeCard } from '@/components/RecipeCard';
import { Recipe } from '@/assets/types/types';
import { router } from 'expo-router';
import SkeletonLoadingItem from '@/components/SkeletonLoadingItem';
import { Header } from '@/components/Header';

// Memoized section title component
const SectionTitle = memo(() => (
    <Text style={styles.sectionTitle}>Recipes</Text>
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
        fontSize: 20,
        fontWeight: 'bold',
        padding: 16,
    },
    listContainer: {
        flex: 1,
    },
    flatListContent: {
        paddingHorizontal: 16,
    },
});
