// app/(tabs)/recipe.tsx
import { StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import React, { memo, useCallback, useMemo } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useRecipeScreenFetcher from '@/hooks/useRecipeScreenFetcher';
import {RecipeCard} from '@/components/RecipeCard';
import { Recipe } from '@/assets/types/types';
import { router } from 'expo-router';

// Memoized header component to prevent unnecessary re-renders
const Header = memo(() => (
    <ThemedView style={styles.header}>
        <ThemedText style={styles.name}>Kariem Gerges</ThemedText>
        <ThemedView style={styles.profileImageContainer}>
            <ThemedView style={styles.profileImage} />
        </ThemedView>
    </ThemedView>
));

// Memoized section title component
const SectionTitle = memo(() => (
    <ThemedText style={styles.sectionTitle}>Recipes</ThemedText>
));

// Memoized loading indicator component
const LoadingIndicator = memo(() => (
    <ActivityIndicator size="large" />
));

// Memoized footer loading component
const ListFooter = memo(({ loading }: { loading: boolean }) => (
    loading ? <ActivityIndicator /> : null
));

// Memoized recipe card wrapper
const MemoizedRecipeCard = memo(({ recipe }: { recipe: Recipe }) => (
    <RecipeCard recipe={recipe} />
));

export default function RecipeScreen() {
    const { recipes, loading, error, refreshing, loadMore, refresh } = useRecipeScreenFetcher();

    // Error handling effect
    React.useEffect(() => {
        if (error) {
            Alert.alert('Error', error);
        }
    }, [error]);

    // Memoized render item function
    const renderItem = useCallback(({ item }: { item: Recipe }) => (
        <TouchableOpacity onPress={() =>
            router.push({
                pathname: '/screens/singleRecipe',
                params: { recipeDetail : JSON.stringify(item) },
            })
        }>
            <MemoizedRecipeCard recipe={item} />
        </TouchableOpacity>
    ), []);

    // Memoized key extractor
    const keyExtractor = useCallback((item: Recipe) => item._id, []);

    // Memoized list footer component
    const listFooterComponent = useMemo(() => (
        <ListFooter loading={loading} />
    ), [loading]);

    // Memoized getItemLayout for fixed height items (adjust height value based on your RecipeCard)
    const getItemLayout = useCallback((data: Recipe[] | null, index: number) => ({
        length: 150,
        offset: 200 * index,
        index,
    }), []);

    // Memoized onEndReached handler with debounce logic
    const handleEndReached = useCallback(() => {
        if (!loading) {
            loadMore();
        }
    }, [loading, loadMore]);

    return (
        <ThemedView style={styles.container}>
            <Header />
            <SectionTitle />

            {/* Recipe list */}
            
            <ThemedView style={styles.listContainer}>
                {loading && recipes.length === 0 ? (
                    <LoadingIndicator />
                ) : (
                    <FlatList
                        data={recipes}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        onEndReached={handleEndReached}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={listFooterComponent}
                        refreshing={refreshing}
                        onRefresh={refresh}
                        contentContainerStyle={styles.flatListContent}
                        getItemLayout={getItemLayout}
                        removeClippedSubviews={true}
                        initialNumToRender={10}
                        maxToRenderPerBatch={5}
                        windowSize={5}
                        updateCellsBatchingPeriod={50}
                    />
                )}
            </ThemedView>

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: 35,
        backgroundColor: '#FFEBC6',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
    },
    profileImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E0E0E0',
        marginLeft: 'auto',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
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