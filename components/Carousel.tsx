import React, { useState } from 'react';
import { Image, StyleSheet, Dimensions, ViewStyle, TextStyle, ImageStyle, Platform } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  interpolate, 
  useAnimatedStyle,
  withSpring 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface Recipe {
  title: string;
  time: string;
  image: string;
  color: string;
}

const data: Recipe[] = [
  { title: 'Spicy Thai Basil Chicken', time: 'Quick 30 min dinner', image: 'https://...', color: '#FF6B6B' },
  { title: 'Creamy Garlic Shrimp', time: 'Quick 20 min dinner', image: 'https://...', color: '#4ECDC4' },
  { title: 'Vegetarian Quinoa Bowl', time: 'Healthy 25 min meal', image: 'https://...', color: '#45B649' },
];

interface RenderItemProps {
  item: Recipe;
  index: number;
  animationValue: Animated.SharedValue<number>;
}

export default function RecipeCarousel(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const renderItem = ({ item, index, animationValue }: RenderItemProps): JSX.Element => {
    const animatedStyle = useAnimatedStyle(() => {
      const translateY = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [50, 0, 50]
      );
      
      const scale = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [0.9, 1, 0.9]
      );

      // Use withSpring for smoother animations on Android
      return {
        transform: [
          { 
            translateY: withSpring(translateY, {
              damping: 20,
              stiffness: 90,
            }) 
          }, 
          { 
            scale: withSpring(scale, {
              damping: 20,
              stiffness: 90,
            }) 
          }
        ],
      };
    });

    return (
      <Animated.View
        style={[
          styles.card,
          animatedStyle,
          { backgroundColor: item.color },
          // Platform-specific shadow styles
          Platform.select({
            ios: styles.cardShadowIOS,
            android: styles.cardShadowAndroid,
          }),
        ]}
      >
        <Image 
          source={{ uri: item.image }} 
          style={styles.image}
          // Add resizeMethod prop for better Android performance
          resizeMethod={Platform.select({
            android: 'resize',
            default: 'auto',
          })}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <ThemedText 
            style={[
              styles.title,
              // Add includeFontPadding for better text rendering on Android
              Platform.select({
                android: { includeFontPadding: false },
                default: {},
              }),
            ]}
          >
            {item.title}
          </ThemedText>
          <ThemedText 
            style={[
              styles.time,
              Platform.select({
                android: { includeFontPadding: false },
                default: {},
              }),
            ]}
          >
            {item.time}
          </ThemedText>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Carousel
        loop
        width={width * 0.85}
        height={400}
        data={data}
        renderItem={renderItem}
        onSnapToItem={(index: number) => setActiveIndex(index)}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        // Add Android-specific props
        scrollAnimationDuration={Platform.select({
          android: 1000,
          default: 500,
        })}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10], // Improve gesture handling on Android
        }}
      />
      <ThemedView style={styles.pagination}>
        {data.map((_, index) => (
          <ThemedView
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </ThemedView>
    </ThemedView>
  );
}

interface Styles {
  container: ViewStyle;
  card: ViewStyle;
  cardShadowIOS: ViewStyle;
  cardShadowAndroid: ViewStyle;
  image: ImageStyle;
  gradient: ViewStyle;
  title: TextStyle;
  time: TextStyle;
  pagination: ViewStyle;
  paginationDot: ViewStyle;
  paginationDotActive: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  // Separate shadow styles for iOS and Android
  cardShadowIOS: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardShadowAndroid: {
    elevation: 6,
    // Add a background color to make elevation work on Android
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: Platform.select({
      ios: 'bold',
      android: '700', // Use numeric weight for better Android support
    }),
    color: '#FFF',
    marginBottom: 5,
  },
  time: {
    fontSize: 16,
    color: '#FFF',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C4C4C4',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#45B649',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});