// HomeScreen.tsx
import { Image, StyleSheet, TouchableOpacity, FlatList, Animated, Dimensions } from 'react-native';
import { Href, router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCarouselRecipe } from '@/hooks/useCarouselRecipe';
import { ChatItem, Recipe } from '@/assets/types/types';
import { RecipeCarousel } from '@/components/Carousel';
import { useRef, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const recentChats: ChatItem[] = [
    { id: '1', name: 'Diana Lopez', message: 'on my way...', time: '2m ago', unread: true },
    { id: '2', name: 'Ahmad Moussaka', message: "what's up dude...", time: '20h ago', unread: false },
    { id: '3', name: 'Brett Duncan', message: 'I need the Kebab Recipe', time: '3d ago', unread: true },
  ];

  const { recipe, loading, error } = useCarouselRecipe();

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 12,
        bounciness: 6,
        useNativeDriver: true,
      })
    ]).start();
  }, []);


  // Header
  const renderHeader = () => {
    const headerHeight = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [140, 100],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <ThemedView>
          <TouchableOpacity 
            onPress={() => router.push('/screens/profileScreen/profile')}
            style={styles.headerContent}
          >
            <Animated.View style={{ transform: [{ scale: headerScale }] }}>
              <ThemedText style={styles.greeting}>Welcome back,</ThemedText>
              <ThemedText style={styles.name}>Kariem Gerges</ThemedText>
            </Animated.View>
          </TouchableOpacity>
        </ThemedView>
        <TouchableOpacity 
          style={styles.profileImageContainer}
          onPress={() => {
            Animated.spring(headerScale, {
              toValue: 0.95,
              speed: 12,
              bounciness: 8,
              useNativeDriver: true,
            }).start(() => {
              headerScale.setValue(1);
              router.push('/screens/SignupScreen');
            });
          }}
        >  
          <Image 
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
          <ThemedView style={styles.statusDot} />
        </TouchableOpacity>
      </Animated.View>
    );
  };


  // Recipes
  const renderRecipeCard = () => (
    <Animated.View 
      // style={[
      //   styles.recipeCard,
      //   {
      //     opacity: fadeAnim,
      //     transform: [{ translateY: slideAnim }]
      //   }
      // ]}
    >
      {loading && (
        <ThemedView style={styles.loadingContainer}>
          <Animated.View
            style={{
              transform: [{
                rotate: scrollY.interpolate({
                  inputRange: [0, 1000],
                    outputRange: ['0deg', '360deg'],
                })
              }]
            }}
          >
            <MaterialIcons name="refresh" size={24} color="#666" />
          </Animated.View>
          <ThemedText style={styles.loadingText}>Loading recipes...</ThemedText>
        </ThemedView>
      )}
      
      {error && (
        <ThemedView style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={24} color="#DC3545" />
          <ThemedText style={styles.errorText}>Couldn't load recipes</ThemedText>
        </ThemedView>
      )}
      
      {!loading && !error && (
        <RecipeCarousel 
          data={recipe} 
          renderItem={({ item, index }: { item: Recipe; index: number }) => (
            <TouchableOpacity 
            onPress={() => router.push(`/recipe/${item.id.toString()}` as Href<string>)}             >
              <Animated.View 
                style={[
                  styles.carouselItem,
                  {
                    transform: [{
                      scale: scrollY.interpolate({
                        inputRange: [-100, 0, 100 * (index + 1)],
                        outputRange: [1.1, 1, 0.9],
                        extrapolate: 'clamp',
                      })
                    }]
                  }
                ]}
              >
              </Animated.View>
            </TouchableOpacity>
          )}
        />
      )}

    </Animated.View>
  );

  const renderChatItem = ({ item, index }: { item: ChatItem; index: number }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ 
          translateX: slideAnim.interpolate({
            inputRange: [0, 50],
            outputRange: [0, 50 * (index + 1)],
          })
        }]
      }}
    >
      <TouchableOpacity
        // onPress={() => router.push(`/chat/${item.id}`)}
        style={styles.chatItemContainer}
        activeOpacity={0.7}
      >
        <ThemedView style={styles.chatItem}>
          <ThemedView style={styles.avatarContainer}>
            <Image 
              source={{ uri: `https://via.placeholder.com/40` }}
              style={styles.chatAvatar}
            />
            {item.unread && <ThemedView style={styles.unreadDot} />}
          </ThemedView>
          <ThemedView style={styles.chatInfo}>
            <ThemedText style={styles.chatName}>{item.name}</ThemedText>
            <ThemedView style={styles.messageContainer}>
              <MaterialIcons name="chat-bubble-outline" size={12} color="#666" />
              <ThemedText style={styles.chatMessage}>{item.message}</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.timeContainer}>
            <MaterialIcons name="access-time" size={12} color="#666" />
            <ThemedText style={styles.chatTime}>{item.time}</ThemedText>
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <Animated.FlatList
      data={recentChats}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          {renderHeader()}
          {renderRecipeCard()}
          <ThemedView style={styles.chatHeader}>
            <ThemedText style={styles.recentChatsTitle}>Recent Chats</ThemedText>
            <TouchableOpacity
              // onPress={() => router.push('/screens/AllChats')}
              style={styles.seeAllButton}
            >
              <ThemedText style={styles.seeAllText}>See all</ThemedText>
              <MaterialIcons name="arrow-forward" size={16} color="#007AFF" />
            </TouchableOpacity>
          </ThemedView>
        </>
      }
      renderItem={renderChatItem}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      scrollEventThrottle={16}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEBC6',

  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#FFEBC6',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    transform: [{ translateY: -10 }],
    backgroundColor: '#FFEBC6',

  },
  greeting: {
    fontSize: 16,
    color: '#8B7355',
    marginBottom: 4,
    backgroundColor: '#FFEBC6',

  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5C4033',
    backgroundColor: '#FFEBC6',
  },
  profileImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#5C4033',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  statusDot: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  recipeCard: {
    margin: 16,
    backgroundColor: '#F098FF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#5C4033',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  carouselItem: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  recipeImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#FFEBC6',
  },
  recipeInfo: {
    padding: 16,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5C4033',
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#8B7355',
    lineHeight: 20,
  },
  recipeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statText: {
    marginLeft: 4,
    marginRight: 12,
    color: '#8B7355',
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
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: '#FFEBC6',

  },
  recentChatsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5C4033',
    
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 14,
    marginRight: 4,
  },
  chatItemContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#5C4033',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: '#FFEBC6',

  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBC6',
  },
  unreadDot: {
    position: 'absolute',
    right: -2,
    top: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5C4033',
    marginBottom: 4,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatMessage: {
    fontSize: 14,
    color: '#8B7355',
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  chatTime: {
    fontSize: 12,
    color: '#8B7355',
    marginLeft: 4,
  },
});