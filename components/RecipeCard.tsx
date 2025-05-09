// components/RecipeCard.tsx
import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Pressable,
    Animated,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import type { Recipe } from '@/assets/types/types';
// import hooks
import { useToggleSaved } from '@/hooks/useToggleSaved';

interface RecipeCardProps {
    recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const { toggleSavedRecipe } = useToggleSaved();

    // Animation setup
    const scaleValue = useState(new Animated.Value(1))[0];

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 1.02,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    //   const handleViewRecipe = () => {
    //     // router.push(`/screens/SingleRecipe/${recipe.id}`);
    //   };

    return (
        <Animated.View
            style={[
                styles.card,
                {
                    transform: [{ scale: scaleValue }],
                },
            ]}
        >
            {/* Image Section */}
            <View style={styles.imageContainer}>
                <Image
                    defaultSource={require('@/assets/images/sginup.webp')}
                    source={{
                        uri: recipe?.image_url
                            ? recipe.image_url
                            : 'https://example.com/default-image.jpg',
                    }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.tagContainer}>
                    {recipe?.tags.map((tag) => (
                        <View key={tag} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.categoryContainer}>
                    <Text style={styles.categoryText}>{recipe?.category}</Text>
                </View>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{recipe?.title}</Text>
                    <View style={styles.authorContainer}>
                        <FontAwesome name="user" size={14} color="#666" />
                        <Text style={styles.authorText}>
                            By {recipe?.author}
                        </Text>
                    </View>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                    {recipe?.description}
                </Text>

                {/* Recipe Info Grid */}
                <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                        <FontAwesome name="clock-o" size={20} color="#666" />
                        <View>
                            <Text style={styles.infoLabel}>Prep Time</Text>
                            <Text style={styles.infoValue}>
                                {recipe?.preparation_time}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <FontAwesome name="globe" size={20} color="#666" />
                        <View>
                            <Text style={styles.infoLabel}>Origin</Text>
                            <Text style={styles.infoValue}>
                                {recipe?.country_of_origin}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <FontAwesome name="list" size={20} color="#666" />
                        <View>
                            <Text style={styles.infoLabel}>Ingredients</Text>
                            <Text style={styles.infoValue}>
                                {recipe?.ingredients.length} items
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <FontAwesome name="tag" size={20} color="#666" />
                        <View>
                            <Text style={styles.infoLabel}>Category</Text>
                            <Text style={styles.infoValue}>
                                {recipe?.category}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.actions}>
                        <Pressable
                            onPress={() => setIsLiked(!isLiked)}
                            style={styles.actionButton}
                        >
                            <FontAwesome
                                name={isLiked ? 'heart' : 'heart-o'}
                                size={24}
                                color={isLiked ? '#FF4444' : '#666'}
                            />
                        </Pressable>

                        <Pressable
                            onPress={() => {
                                setIsSaved(!isSaved);
                                toggleSavedRecipe((recipe.id).toString());
                            }}
                            style={styles.actionButton}
                        >
                            <FontAwesome
                                name={isSaved ? 'bookmark' : 'bookmark-o'}
                                size={24}
                                color={isSaved ? '#4444FF' : '#666'}
                            />
                        </Pressable>
                    </View>

                    {/* <Pressable
            style={styles.viewButton}
            onPress={handleViewRecipe}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.viewButtonText}>View Recipe</Text>
          </Pressable> */}
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
    },
    imageContainer: {
        position: 'relative',
        height: 200,
        backgroundColor: '#f0f0f0',
    },
    image: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        backgroundColor: 'rgba(247, 182, 154, 0.3)',
    },
    tagContainer: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    tag: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
    },
    tagText: {
        color: 'white',
        fontSize: 12,
    },
    categoryContainer: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 8,
    },
    categoryText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        padding: 16,
    },
    header: {
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    authorText: {
        color: '#666',
        fontSize: 14,
    },
    description: {
        color: '#666',
        marginBottom: 16,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        minWidth: '45%',
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    infoValue: {
        color: '#666',
        fontSize: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    actions: {
        flexDirection: 'row',
        gap: 16,
    },
    actionButton: {
        padding: 8,
    },
    viewButton: {
        backgroundColor: '#FF6B35',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    viewButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});
