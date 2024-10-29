import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, FlatList } from 'react-native';

interface ChatItem {
    id: string;
    name: string;
    message: string;
    time: string;
  }

  const recentChats: ChatItem[] = [
    { id: '1', name: 'Diana Lopez', message: 'on my way...', time: '2m ago' },
    { id: '2', name: 'Ahmad Moussaka', message: "what's up dude...", time: '20h ago' },
    { id: '3', name: 'Brett Duncan', message: 'I need the Kebab Recipe', time: '3d ago' },
  ]


export default function ChatScreen() {

    return (
        <ParallaxScrollView
        // style={styles.container}
        >
    
          <ThemedView style={styles.header}>
            <ThemedText style={styles.name}>Kariem Gerges</ThemedText>
            <ThemedView style={styles.profileImageContainer}>
              <ThemedView style={styles.profileImage} />
            </ThemedView>
          </ThemedView>
    
    
          <ThemedView style={styles.recentChatsContainer}>
            <ThemedText style={styles.recentChatsTitle}>Chats</ThemedText>
            
            <FlatList
              data={recentChats}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
    
                <ThemedView style={styles.chatItem}>
                  <ThemedView style={styles.chatAvatar} />
                    <ThemedView style={styles.chatInfo}>
                        <ThemedText style={styles.chatName}>{item.name}</ThemedText>
                        <ThemedText style={styles.chatMessage}>{item.message}</ThemedText>
                    </ThemedView>
                    <ThemedText style={styles.chatTime}>{item.time}</ThemedText>
                </ThemedView>
    
              )}
            />
    
            <FlatList
              data={recentChats}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
    
                <ThemedView style={styles.chatItem}>
                  <ThemedView style={styles.chatAvatar} />
                    <ThemedView style={styles.chatInfo}>
                        <ThemedText style={styles.chatName}>{item.name}</ThemedText>
                        <ThemedText style={styles.chatMessage}>{item.message}</ThemedText>
                    </ThemedView>
                    <ThemedText style={styles.chatTime}>{item.time}</ThemedText>
                </ThemedView>
                
              )}
            />
    
            <FlatList
              data={recentChats}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
    
                <ThemedView style={styles.chatItem}>
                  <ThemedView style={styles.chatAvatar} />
                    <ThemedView style={styles.chatInfo}>
                        <ThemedText style={styles.chatName}>{item.name}</ThemedText>
                        <ThemedText style={styles.chatMessage}>{item.message}</ThemedText>
                    </ThemedView>
                    <ThemedText style={styles.chatTime}>{item.time}</ThemedText>
                </ThemedView>
                
              )}
            />
    
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
      // marginTop: 30,
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
    recentChatsContainer: {
      flex: 1,
      padding: 16,
    },
    recentChatsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    chatContainer: {
      flexDirection: 'column',
      gap: 16,
    },
    chatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    chatAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#E0E0E0',
    },
    chatInfo: {
      flex: 1,
      marginLeft: 12,
    },
    chatName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    chatMessage: {
      fontSize: 14,
      color: 'gray',
    },
    chatTime: {
      fontSize: 12,
      color: 'gray',
    }
    });