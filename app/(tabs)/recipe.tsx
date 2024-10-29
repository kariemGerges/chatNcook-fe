import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function RecipeScreen() {
  return (
    <ParallaxScrollView
    //  style={styles.container}
    >

      <ThemedView style={styles.header}>
        <ThemedText style={styles.name}>Kariem Gerges</ThemedText>
        <ThemedView style={styles.profileImageContainer}>
          <ThemedView style={styles.profileImage} />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.recipeCardsContainer}>
          <ThemedView style={styles.recipeCard}>
            <Image
              source={{ uri: 'https://example.com/spicy-thai-basil-chicken.jpg' }}
              style={styles.recipeImage}
            />
            <ThemedText style={styles.recipeTitle}>Spicy Thai Basil Chicken</ThemedText>
            <ThemedText style={styles.recipeSubtitle}>Quick 30 min dinner</ThemedText>
          </ThemedView>

          <ThemedView style={styles.recipeCard}>
            <Image
              source={{ uri: 'https://example.com/spicy-thai-basil-chicken.jpg' }}
              style={styles.recipeImage}
            />
            <ThemedText style={styles.recipeTitle}>Spicy Thai Basil Chicken</ThemedText>
            <ThemedText style={styles.recipeSubtitle}>Quick 30 min dinner</ThemedText>
          </ThemedView>

          <ThemedView style={styles.recipeCard}>
            <Image
              source={{ uri: 'https://example.com/spicy-thai-basil-chicken.jpg' }}
              style={styles.recipeImage}
            />
            <ThemedText style={styles.recipeTitle}>Spicy Thai Basil Chicken</ThemedText>
            <ThemedText style={styles.recipeSubtitle}>Quick 30 min dinner</ThemedText>
          </ThemedView>

          <ThemedView style={styles.recipeCard}>
            <Image
              source={{ uri: 'https://example.com/spicy-thai-basil-chicken.jpg' }}
              style={styles.recipeImage}
            />
            <ThemedText style={styles.recipeTitle}>Spicy Thai Basil Chicken</ThemedText>
            <ThemedText style={styles.recipeSubtitle}>Quick 30 min dinner</ThemedText>
          </ThemedView>
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffff',
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
  iconButton: {
    marginLeft: 16,
  },
  recipeCardsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  recipeCard: {
    borderRadius: 8,
    overflow: 'hidden',
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#FFEBC6',
  },
  recipeImage: {
    width: '100%',
    height: 150,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 8,
    color: '#000000',
  },
  recipeSubtitle: {
    fontSize: 14,
    color: 'gray',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});