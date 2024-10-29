import { Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { router, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
interface ChatItem {
  id: string;
  name: string;
  message: string;
  time: string;
}

export default function HomeScreen() {

  const recentChats: ChatItem[] = [
    { id: '1', name: 'Diana Lopez', message: 'on my way...', time: '2m ago' },
    { id: '2', name: 'Ahmad Moussaka', message: "what's up dude...", time: '20h ago' },
    { id: '3', name: 'Brett Duncan', message: 'I need the Kebab Recipe', time: '3d ago' },
  ];

  return (
    <FlatList
      data={recentChats}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          <ThemedView style={styles.header}>
            <ThemedText style={styles.name}>Kariem Gerges</ThemedText>
              <TouchableOpacity 
                style={styles.profileImageContainer}
                onPress={() => {router.push('/screens/SignupScreen')}}
              >  
                <ThemedView style={styles.profileImageContainer}>
                  <ThemedView style={styles.profileImage} />
                </ThemedView>
              </TouchableOpacity>
          </ThemedView>
          <ThemedView style={styles.recipeCard}>
            <Image
              source={{ uri: 'https://example.com/spicy-thai-basil-chicken.jpg' }}
              style={styles.recipeImage}
            />
            <ThemedText style={styles.recipeTitle}>Spicy Thai Basil Chicken</ThemedText>
            <ThemedText style={styles.recipeSubtitle}>Quick 30 min dinner</ThemedText>
            {/* <Carousel /> */}
          </ThemedView>
          <ThemedText style={styles.recentChatsTitle}>Recent Chats</ThemedText>
        </>
      }
      renderItem={({ item }) => (
        <ThemedView style={styles.chatItemsContainer}>
          <ThemedView style={styles.chatItem}>
            <ThemedView style={styles.chatAvatar} />
            <ThemedView style={styles.chatInfo}>
              <ThemedText style={styles.chatName}>{item.name}</ThemedText>
              <ThemedText style={styles.chatMessage}>{item.message}</ThemedText>
            </ThemedView>
            <ThemedText style={styles.chatTime}>{item.time}</ThemedText>
          </ThemedView>
        </ThemedView>
      )}
    />
    )
  
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
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
    recipeCard: {
      margin: 16,
      backgroundColor: '#FFEBC6',
      borderRadius: 8,
      overflow: 'hidden',
    },
    recipeImage: {
      width: '100%',
      height: 200,
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
    recentChatsContainer: {
      flex: 1,
      padding: 16,
    },
    recentChatsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    chatItem: {
      backgroundColor: '#E0E0E0',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    chatAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#ffffff',
    },
    chatInfo: {
      flex: 1,
      marginLeft: 12,
    },
    chatName: {
      backgroundColor: '#E0E0E0',
      fontSize: 16,
      fontWeight: 'bold',
    },
    chatMessage: {
      backgroundColor: '#E0E0E0',
      fontSize: 14,
      color: 'gray',
    },
    chatTime: {
      fontSize: 12,
      color: 'gray',
    },
    navbar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
    },
    navItem: {
      alignItems: 'center',
    },
    carouselContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    chatItemsContainer: {
      backgroundColor: '#E0E0E0',
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginBottom: 8,
    }
  });
