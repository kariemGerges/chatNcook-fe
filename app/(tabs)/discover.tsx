import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    Animated,
} from 'react-native';
import React, { memo, useCallback, useMemo, useRef, useEffect } from 'react';

// import Hooks
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
        {/* Search bar component */}
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

    const scrollY = useRef(new Animated.Value(0)).current;

    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, 100], // distance over which the header will move
        outputRange: [0, -100], // from fully visible to fully hidden
        extrapolate: 'clamp',
    });

    // Error handling effect
    useEffect(() => {
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
});
