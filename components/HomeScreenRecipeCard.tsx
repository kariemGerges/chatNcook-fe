import {
    Image,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Recipe } from '@/assets/types/types';
import { MaterialIcons } from '@expo/vector-icons';
import { useRef } from 'react';
import { useCarouselRecipe } from '@/hooks/useCarouselRecipe';
import { RecipeCarousel } from '@/components/Carousel';
import { Href, router } from 'expo-router';
import SkeletonLoadingItem from './SkeletonLoadingItem';



export default function HomeScreenRecipeCard() {
    const { recipe, loading: recipeLoading, error } = useCarouselRecipe();

     // Animation values
    const scrollY = useRef(new Animated.Value(0)).current;
    const headerScale = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    return (
        <Animated.View style={styles.container}>
            {recipeLoading && (
                <ThemedView style={styles.loadingContainer}>
                    <Animated.View
                        style={{
                            transform: [
                                {
                                    rotate: scrollY.interpolate({
                                        inputRange: [0, 1000],
                                        outputRange: ['0deg', '360deg'],
                                    }),
                                },
                            ],
                        }}
                    >
                        <MaterialIcons name="refresh" size={24} color="#666" />
                    </Animated.View>
                    <ThemedText style={styles.loadingText}>
                        <SkeletonLoadingItem />
                    </ThemedText>
                </ThemedView>
            )}

            {error && (
                <ThemedView style={styles.errorContainer}>
                    <MaterialIcons
                        name="error-outline"
                        size={24}
                        color="#DC3545"
                    />
                    <ThemedText style={styles.errorText}>
                        Couldn't load recipes
                    </ThemedText>
                </ThemedView>
            )}

            {!recipeLoading && !error && (
                <RecipeCarousel
                    data={recipe}
                    renderItem={({
                        item,
                        index,
                    }: {
                        item: Recipe;
                        index: number;
                    }) => (
                        <TouchableOpacity
                            onPress={() =>
                                router.push(
                                    `/recipe/${item.id.toString()}` as Href
                                )
                            }
                        >
                            <Animated.View
                                style={[
                                    styles.carouselItem,
                                    {
                                        transform: [
                                            {
                                                scale: scrollY.interpolate({
                                                    inputRange: [
                                                        -100,
                                                        0,
                                                        100 * (index + 1),
                                                    ],
                                                    outputRange: [1.1, 1, 0.9],
                                                    extrapolate: 'clamp',
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            ></Animated.View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFEBC6',
        padding: 16,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    loadingText: {
        color: '#8B7355',
        marginTop: 8,
    },
    errorContainer: {
        padding: 40,
        alignItems: 'center',
    },
    errorText: {
        color: '#DC3545',
        marginTop: 8,
    },
    carouselItem: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 8,
    },
});