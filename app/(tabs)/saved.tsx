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
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { firestore, auth } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import useFetchRecipeById from '@/hooks/useFetchRecipeById';
import { Recipe } from '@/assets/types/types';

export default function SavedRecipesScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [viewRecipes, setViewRecipes] = useState<Recipe[]>([]);
    const [recipeIds, setRecipeIds] = useState<number[]>([]);
    const [idsLoading, setIdsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [error, setError] = useState<string | null>(null);

    /* ──────────────────────────────────────────
     realtime listener for saved recipe IDs  */
    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (!uid) {
            setError('You must be logged in to view saved recipes');
            setIdsLoading(false);
            return;
        }

        const savedRef = collection(firestore, 'users', uid, 'savedRecipes');
        const unsubscribe = onSnapshot(
            savedRef,
            (snap) => {
                const ids = snap.docs.map((d) => Number(d.id));
                setRecipeIds(ids);
                setIdsLoading(false);
            },
            () => {
                setError('Failed to load saved recipes');
                setIdsLoading(false);
            }
        );

        return unsubscribe;
    }, [auth.currentUser?.uid]);

    /* ──────────────────────────────────────────
     fetch recipe documents by ID list        */
    const {
        recipes,
        loading: recipeLoading,
        error: recipeError,
        refreshing,
        refresh,
    } = useFetchRecipeById(recipeIds);

    useEffect(() => {
        setViewRecipes(recipes);
    }, [recipes]);

    /* ──────────────────────────────────────────
     unsave–delete flow                       */
    const unsaveRecipe = async (recipeId: number) => {
        try {
            const uid = auth.currentUser?.uid;
            if (!uid) return;

            await deleteDoc(
                doc(firestore, 'users', uid, 'savedRecipes', `${recipeId}`)
            );

            setRecipeIds((prev) => prev.filter((id) => id !== recipeId));

            setViewRecipes((prev) => prev.filter((r) => r.id !== recipeId));

            // refresh();
        } catch {
            setError('Failed to remove recipe');
        }
    };

    /* ──────────────────────────────────────────
     navigation                               */
    const viewRecipeDetails = (recipe: Recipe) => {
        router.push({
            pathname: '/screens/singleRecipe',
            params: { recipeDetail: JSON.stringify(recipe) },
        });
    };

    /* ──────────────────────────────────────────
     filtering                                */
    const filters = ['All', 'Italian', 'Quick', 'Vegetarian', 'Recent'];

    const getFilteredRecipes = (): Recipe[] => {
        if (activeFilter === 'All') return viewRecipes;
        if (activeFilter === 'Recent') return [...viewRecipes].slice(0, 5);

        const key = activeFilter.toLowerCase();
        return viewRecipes.filter((r) => (r.tags ?? []).includes(key));
    };

    /* ──────────────────────────────────────────
     ui guards                                */

    if (idsLoading || recipeLoading) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#FE724C" />
                <Text style={styles.loadingText}>
                    Loading your saved recipes…
                </Text>
            </SafeAreaView>
        );
    }

    if (error || recipeError) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <Ionicons
                    name="alert-circle-outline"
                    size={64}
                    color="#FF3B30"
                />
                <Text style={styles.errorText}>{error || recipeError}</Text>
            </SafeAreaView>
        );
    }

    /* ──────────────────────────────────────────
     render helpers                           */
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

    const renderRecipeCard = ({ item }: { item: Recipe }) => (
        <TouchableOpacity
            style={styles.recipeCard}
            onPress={() => viewRecipeDetails(item)}
        >
            <Image
                source={
                    item.image_url
                        ? { uri: item.image_url }
                        : require('@/assets/images/favicon.png')
                }
                style={styles.recipeImage}
            />

            <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.recipeAuthor}>by {item.author}</Text>

                <View style={styles.recipeMeta}>
                    <View style={styles.prepTime}>
                        <Ionicons name="time-outline" size={14} color="#666" />
                        <Text style={styles.prepTimeText}>
                            {item.preparation_time}
                        </Text>
                    </View>

                    <View style={styles.tagRow}>
                        {(item.tags ?? []).slice(0, 2).map((tag) => (
                            <View key={tag} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            <View style={styles.recipeActions}>
                <TouchableOpacity onPress={() => unsaveRecipe(item.id)}>
                    <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    /* ──────────────────────────────────────────
     jsx                                      */
    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Saved Recipes</Text>
                <Ionicons name="options-outline" size={24} color="#FE734D" />
            </View>

            <FlatList
                data={filters}
                horizontal
                renderItem={({ item }) => renderFilterChip(item)}
                keyExtractor={(f) => f}
                showsHorizontalScrollIndicator={false}
                style={styles.filterList}
            />

            <FlatList
                data={getFilteredRecipes()}
                renderItem={renderRecipeCard}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.recipeList}
                onRefresh={refresh}
                refreshing={refreshing}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons
                            name="bookmark-outline"
                            size={80}
                            color="#CCC"
                        />
                        <Text style={styles.emptyText}>
                            No saved recipes found
                        </Text>
                        <Text style={styles.emptySub}>
                            Recipes you save will appear here
                        </Text>
                        <TouchableOpacity
                            style={styles.discoverButton}
                            onPress={() => router.push('/discover')}
                        >
                            <Text style={styles.discoverText}>
                                Discover Recipes
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

/* ──────────────────────────────────────────
   styles                                    */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F8F8' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 16, fontSize: 16, color: '#666' },

    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },

    filterList: {
        backgroundColor: 'rgba(247, 182, 154, 0.3)',
        paddingVertical: 12,
        paddingLeft: 16,
        maxHeight: 65,
    },
    filterChip: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        marginRight: 8,
    },
    activeFilterChip: { backgroundColor: '#FE724C' },
    filterChipText: { fontSize: 14, color: '#666' },
    activeFilterChipText: { color: '#FFF', fontWeight: '500' },

    recipeList: { padding: 16 },
    recipeCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3,
    },
    recipeImage: {
        width: 90,
        height: 90,
        borderRadius: 8,
        margin: 12,
        backgroundColor: 'rgba(247, 182, 154, 0.3)',
    },
    recipeInfo: { flex: 1, padding: 12, justifyContent: 'center' },
    recipeTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    recipeAuthor: { fontSize: 13, color: '#666', marginBottom: 8 },
    recipeMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    prepTime: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
    prepTimeText: { fontSize: 12, color: '#666', marginLeft: 4 },
    tagRow: { flexDirection: 'row' },
    tag: {
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 4,
    },
    tagText: { fontSize: 10, color: '#666' },

    recipeActions: { justifyContent: 'center', padding: 12 },

    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 16,
    },
    emptySub: {
        fontSize: 14,
        color: '#999',
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
    discoverText: { color: '#FFF', fontWeight: '600' },
});
