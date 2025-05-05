// app/recipe/[id].tsx
import { View, Text, Image, ScrollView, StyleSheet, Share, Pressable, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { memo, useEffect, useState } from 'react';
import { Recipe } from '@/assets/types/types';
import Animated, { 
  FadeInDown, 
  FadeIn, 
  interpolate, 
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const HEADER_HEIGHT = 250;
const { width } = Dimensions.get('window');

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const LoadingIndicator = memo(() => (
  <ActivityIndicator size="large" />
))

export default function RecipeDetails() {
  const { recipeDetail } = useLocalSearchParams();
  const parsedRecipeDetail = recipeDetail ? JSON.parse(recipeDetail as string) : null;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    setRecipe(parsedRecipeDetail);
    checkIfBookmarked();
  }, []);

  const checkIfBookmarked = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarkedRecipes');
      if (bookmarks) {
        const bookmarksList = JSON.parse(bookmarks);
        setIsBookmarked(bookmarksList.includes(recipe?.id));
      }
    } catch (error) {
      console.error('Error checking bookmarks:', error);
    }
  };

  const toggleBookmark = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarkedRecipes');
      let bookmarksList = bookmarks ? JSON.parse(bookmarks) : [];
      
      if (isBookmarked) {
        bookmarksList = bookmarksList.filter((bookmarkId: string) => bookmarkId !== recipe?.id as unknown as string);
      } else {
        bookmarksList.push(recipe?.id);
      }
      
      await AsyncStorage.setItem('bookmarkedRecipes', JSON.stringify(bookmarksList));
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const shareRecipe = async () => {
    try {
      await Share.share({
        message: `Check out this amazing recipe for ${recipe?.title}! ${recipe?.description}`,
        title: recipe?.title,
      });
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      [2, 1, 0.75]
    );

    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT / 2],
      [1, 0]
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Animated.View 
          entering={FadeIn.duration(800)}
          style={styles.loadingContainer}
        >
          <MaterialCommunityIcons name="food-variant" size={48} color="#666" />
          <Text style={styles.loadingText}>Loading recipe...</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.imageContainer, headerAnimatedStyle]}>
          <Image
            source={{ uri: recipe.image_url }}
            style={styles.image}
            defaultSource={require('@/assets/images/sginup.webp')}
          />
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.duration(600).springify()}
          style={styles.contentContainer}
        >
          <View style={styles.headerRow}>
            <Text style={styles.title}>{recipe.title}</Text>
            <View style={styles.actionButtons}>
              <Pressable onPress={shareRecipe} style={styles.iconButton}>
                <MaterialCommunityIcons name="share-variant" size={24} color="#666" />
              </Pressable>
              <Pressable onPress={toggleBookmark} style={styles.iconButton}>
                <MaterialCommunityIcons 
                  name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                  size={24} 
                  color={isBookmarked ? "#ff6b6b" : "#666"} 
                />
              </Pressable>
            </View>
          </View>
          
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="account-circle" size={20} color="#666" />
              <Text style={styles.metaText}>By {recipe.author}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
              <Text style={styles.metaText}>{recipe.preparation_time}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
              <Text style={styles.metaText}>{recipe.country_of_origin}</Text>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            {recipe.tags?.map((tag, index) => (
              <Animated.View 
                key={index}
                entering={FadeInDown.delay(index * 100)}
                style={styles.tag}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </Animated.View>
            ))}
          </View>

          <Animated.View 
            entering={FadeInDown.delay(200)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{recipe.description}</Text>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(300)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients?.map((ingredient, index) => (
              <View key={index} style={styles.ingredientRow}>
                <MaterialCommunityIcons name="circle-small" size={24} color="#666" />
                <Text style={styles.ingredient}>{ingredient}</Text>
              </View>
            ))}
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(400)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Preparation Steps</Text>
            <Text style={styles.steps}>{recipe.preparation_steps}</Text>
          </Animated.View>
        </Animated.View>
      </AnimatedScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  imageContainer: {
    height: HEADER_HEIGHT,
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFEBC6',
    marginTop: -24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: '#666',
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#666',
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  description: {
    color: '#444',
    lineHeight: 24,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredient: {
    color: '#444',
    flex: 1,
    lineHeight: 20,
  },
  steps: {
    color: '#444',
    lineHeight: 24,
  },
});