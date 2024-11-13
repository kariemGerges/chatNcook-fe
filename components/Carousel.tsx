// import React, { useRef, useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   Animated,
//   PanResponder,
//   Dimensions,
//   StyleSheet,
//   TouchableOpacity,
//   ViewStyle,
//   ActivityIndicator,
// } from 'react-native';
// import { Recipe, CarouselProps } from '@/assets/types/types';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const CARD_WIDTH = SCREEN_WIDTH * 0.85;
// const SPACING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

// const DEFAULT_IMAGE = 'https://via.placeholder.com/400x200';

// export const RecipeCarousel: React.FC<CarouselProps> = ({
//   data = [],
//   autoPlayInterval = 3000,
//   initialAutoPlay = true,
//   cardStyle,
//   containerStyle,
// }) => {
//   // Guard clause for empty data
//   if (!data || data.length === 0) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Text>No recipes available</Text>
//       </View>
//     );
//   }

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(initialAutoPlay);
//   const scrollX = useRef(new Animated.Value(0)).current;
//   const position = useRef(Animated.divide(scrollX, CARD_WIDTH)).current;

//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (isAutoPlaying && data.length > 1) {
//       interval = setInterval(() => {
//         const nextIndex = (currentIndex + 1) % data.length;
//         animateToIndex(nextIndex);
//       }, autoPlayInterval);
//     }
//     return () => interval && clearInterval(interval);
//   }, [currentIndex, isAutoPlaying, data.length]);

//   const animateToIndex = (index: number) => {
//     Animated.spring(scrollX, {
//       toValue: index * CARD_WIDTH,
//       useNativeDriver: true,
//       tension: 50,
//       friction: 7,
//     }).start();
//     setCurrentIndex(index);
//   };

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderStart: () => setIsAutoPlaying(false),
//       onPanResponderMove: (_, { dx }) => {
//         scrollX.setValue(currentIndex * CARD_WIDTH - dx);
//       },
//       onPanResponderEnd: (_, { dx }) => {
//         const direction = dx > 0 ? -1 : 1;
//         const threshold = CARD_WIDTH / 3;
//         const shouldSwipe = Math.abs(dx) > threshold;

//         if (shouldSwipe) {
//           const nextIndex = Math.max(
//             0,
//             Math.min(currentIndex + direction, data.length - 1)
//           );
//           animateToIndex(nextIndex);
//         } else {
//           animateToIndex(currentIndex);
//         }
//       },
//     })
//   ).current;

//   const renderCard = (item: Recipe, index: number) => {
//     if (!item) return null;

//     const inputRange = [
//       (index - 1) * CARD_WIDTH,
//       index * CARD_WIDTH,
//       (index + 1) * CARD_WIDTH,
//     ];

//     const scale = scrollX.interpolate({
//       inputRange,
//       outputRange: [0.9, 1, 0.9],
//       extrapolate: 'clamp',
//     });

//     const opacity = scrollX.interpolate({
//       inputRange,
//       outputRange: [0.7, 1, 0.7],
//       extrapolate: 'clamp',
//     });

//     return (
//       <Animated.View
//         key={item._id}
//         style={[
//           styles.card,
//           cardStyle,
//           {
//             transform: [{ scale }],
//             opacity,
//           },
//         ]}
//       >
//         <View style={styles.imageContainer}>
//           <Image
//             source={{ uri: item.image_url || DEFAULT_IMAGE }}
//             style={styles.image}
//             resizeMode="cover"
//             onError={(e) => {
//               console.log('Image loading error:', e.nativeEvent.error);
//             }}
//             defaultSource={require('@/assets/images/sginup.webp')}
//           />
//         </View>
//         <View style={styles.cardContent}>
//           <Text style={styles.title}>{item.title || 'Untitled Recipe'}</Text>
//           <Text style={styles.description} numberOfLines={2}>
//             {item.description || 'No description available'}
//           </Text>
//           <Text style={styles.time}>
//             Preparation time: {item.preparation_time || 'N/A'}
//           </Text>
//         </View>
//       </Animated.View>
//     );
//   };

//   const renderPagination = () => {
//     return (
//       <View style={styles.pagination}>
//         {data.map((_, index) => {
//           const opacity = position.interpolate({
//             inputRange: [index - 1, index, index + 1],
//             outputRange: [0.3, 1, 0.3],
//             extrapolate: 'clamp',
//           });

//           return (
//             <Animated.View
//               key={index}
//               style={[styles.paginationDot, { opacity }]}
//             />
//           );
//         })}
//       </View>
//     );
//   };

//   const getValidData = () => {
//     if (data.length < 3) {
//       return [...data, ...Array(3 - data.length).fill(data[0])];
//     }
//     return data;
//   };

//   return (
//     <View style={[styles.container, containerStyle]}>
//       <TouchableOpacity
//         style={styles.playButton}
//         onPress={() => setIsAutoPlaying(!isAutoPlaying)}
//       >
//         <Text>{isAutoPlaying ? '⏸️' : '▶️'}</Text>
//       </TouchableOpacity>
//       <Animated.View
//         style={styles.carouselContainer}
//         {...panResponder.panHandlers}
//       >
//         {getValidData().map((item, index) => renderCard(item, index))}
//       </Animated.View>
//       {renderPagination()}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   carouselContainer: {
//     height: 400,
//   },
//   imageContainer: {
//     width: '100%',
//     height: 200,
//     backgroundColor: '#f0f0f0',
//   },
//   card: {
//     width: CARD_WIDTH,
//     height: 350,
//     marginHorizontal: SPACING,
//     borderRadius: 20,
//     backgroundColor: 'white',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     overflow: 'hidden',
//   },
//   image: {
//     width: '100%',
//     height: 200,
//   },
//   cardContent: {
//     padding: 15,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   description: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 8,
//   },
//   time: {
//     fontSize: 12,
//     color: '#999',
//   },
//   pagination: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 15,
//   },
//   paginationDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#000',
//     marginHorizontal: 4,
//   },
//   playButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 1,
//     padding: 10,
//   },
// });


import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  Text,
  Image,
  ViewStyle,
} from 'react-native';
import { Recipe, CarouselProps } from '@/assets/types/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.85;

export const RecipeCarousel: React.FC<CarouselProps> = ({
  data = [],
  containerStyle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const renderItem = useCallback(({ item }: { item: Recipe }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image_url || 'https://via.placeholder.com/400x200' }}
        style={styles.image}
        defaultSource={require('@/assets/images/sginup.webp')}
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title || 'Untitled Recipe'}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description || 'No description available'}
        </Text>
      </View>
    </View>
  ), []);

  const onScroll = useCallback((event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setCurrentIndex(roundIndex);
  }, []);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: CARD_WIDTH,
    offset: CARD_WIDTH * index,
    index,
  }), []);

  if (!data?.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No recipes available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <FlatList
        data={data}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        onScroll={onScroll}
        getItemLayout={getItemLayout}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.contentContainer}
      />
      <View style={styles.pagination}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentIndex === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // height: 400,
  },
  contentContainer: {
    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
  },
  card: {
    width: CARD_WIDTH,
    marginHorizontal: 10,
    borderRadius: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#000',
  },
});