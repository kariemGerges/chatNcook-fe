
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
        source={{ uri: item.image_url || '' }}
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
    // paddingVertical: 20,
    marginBottom: 20,
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