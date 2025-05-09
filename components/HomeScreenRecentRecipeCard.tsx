import React, { useState, useEffect } from 'react';
import {
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Dimensions,
    FlatList,
} from 'react-native';
import { router } from 'expo-router';

import { Recipe } from '@/assets/types/types';
import { Ionicons } from '@expo/vector-icons';
import { useCarouselRecipe } from '@/hooks/useCarouselRecipe';
import { MaterialIcons } from '@expo/vector-icons';
import SkeletonLoadingItem from './SkeletonLoadingItem';
import { firestore, auth } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

interface Props {
    toggleSaved: (id: string) => void;
}

export default function HomeScreenRecentRecipeCard({ toggleSaved }: Props) {
    // Fetching trending recipes
    const { recipe, loading: recipeLoading, error } = useCarouselRecipe();

    const displayedRecipes = recipe?.slice(0, 4);

    const [isSaved, setIsSaved] = useState<number[]>([]);

    const currentUser = auth.currentUser;
    const userId = currentUser?.uid;
    const savedRef = userId
        ? collection(firestore, 'users', userId, 'savedRecipes')
        : null;

    useEffect(() => {
        const fetchSavedRecipes = async () => {
            if (savedRef) {
                const savedSnap = await getDocs(savedRef);
                setIsSaved(savedSnap.docs.map((doc) => Number(doc.id)));
            }
        };
        fetchSavedRecipes();
    }, [savedRef]);

    const renderRecentRecipe = ({ item }: { item: Recipe }) => (
        <TouchableOpacity
            onPress={() =>
                router.push({
                    pathname: '/screens/singleRecipe',
                    params: { recipeDetail: JSON.stringify(item) },
                })
            }
            style={styles.recentCard}
        >
            <Image
                source={{
                    uri: item.image_url
                        ? item.image_url
                        : require('@/assets/images/sginup.webp'),
                }}
                style={styles.recentImage}
            />
            <View style={styles.recentInfo}>
                <Text style={styles.recentTitle} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.recentChef} numberOfLines={1}>
                    by {item.author}
                </Text>
                <View style={styles.recentStats}>
                    <Text style={styles.recentTime}>
                        {item.preparation_time}
                    </Text>
                    {/* <View style={styles.recentLikes}>
                        <Ionicons name="heart" size={12} color="#FF4B4B" />
                        <Text style={styles.recentLikesText}>
                            {item.likes ? item.likes : 1158}
                        </Text>
                    </View> */}
                </View>
            </View>
            <TouchableOpacity
                style={styles.recentSaveButton}
                onPress={() => toggleSaved(item.id.toString())}
            >
                <Ionicons
                    name={
                        isSaved.includes(Number(item.id))
                            ? 'bookmark'
                            : 'bookmark-outline'
                    }
                    size={16}
                    color={
                        isSaved.includes(Number(item.id))
                            ? '#FE724C'
                            : '#777777'
                    }
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View>
            {recipeLoading && <SkeletonLoadingItem />}
            {error && (
                <View style={styles.errorContainer}>
                    <MaterialIcons
                        name="error-outline"
                        size={24}
                        color="#DC3545"
                    />
                    <Text style={styles.errorText}>Couldn't load recipes</Text>
                </View>
            )}
            {!recipeLoading && !error && (
                <>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recently add </Text>
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: '/(tabs)/discover',
                                })
                            }
                        >
                            <Text style={styles.seeAllText}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.recentGrid}>
                        {displayedRecipes.map((recipe) => (
                            <View
                                key={recipe.id}
                                style={{ width: '48%', marginBottom: 16 }}
                            >
                                {renderRecentRecipe({ item: recipe })}
                            </View>
                        ))}
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    seeAllText: {
        fontSize: 14,
        color: '#FE724C',
    },

    errorContainer: {
        padding: 40,
        alignItems: 'center',
    },
    errorText: {
        color: '#DC3545',
        marginTop: 8,
    },
    recentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
        flex: 1,
    },
    recentImage: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
        backgroundColor: 'rgba(247, 182, 154, 0.3)',
    },
    recentInfo: {
        padding: 10,
    },
    recentTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
    },
    recentChef: {
        fontSize: 11,
        color: '#777777',
        marginTop: 2,
    },
    recentStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
    },
    recentTime: {
        fontSize: 11,
        color: '#777777',
    },
    recentLikes: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recentLikesText: {
        fontSize: 11,
        color: '#777777',
        marginLeft: 3,
    },
    recentSaveButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 6,
        padding: 4,
    },
    recentGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 100,
    },
});
