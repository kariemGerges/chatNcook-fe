import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import useUserProfileData from '@/hooks/useUserProfileData';
import useUserChatFetcher from '@/hooks/useChatDataFetcher';
import useUserChatMessagesFetcher from '@/hooks/useChatMessageFetcher';
import { Chats } from '@/assets/types/types';
import { useEffect, useState } from 'react';
import { set } from 'zod';

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



const ChatScreen =({ chatId }: { chatId: string[] })=> {

// Getting user data
  // const {user, profileData, loading, error } = useUserProfileData();

// Getting chat data which includes user's chats and messages in each chat
  // const { data, loading: loadingChats, error: errorChats } = useUserChatFetcher(user?.uid ?? null);


    return (
        <View>
    
          <View style={styles.header}>
            <Text style={styles.name}>
              {/* {profileData?.name} */} hardcode name
              </Text>
            <View style={styles.profileImageContainer}>
              <Image source={{ 
                // uri: profileData?.avatar 
                }} style={styles.profileImage} />
            </View>
          </View>
    
    
          <View style={styles.recentChatsContainer}>
            <Text style={styles.recentChatsTitle}>Chats</Text>
            
            <FlatList
              data={recentChats}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
    
                <View style={styles.chatItem}>
                  <View style={styles.chatAvatar} />
                    <View style={styles.chatInfo}>
                        <Text style={styles.chatName}>{item.name}</Text>
                        <Text style={styles.chatMessage}>{item.message}</Text>
                    </View>
                    <Text style={styles.chatTime}>{item.time}</Text>
                </View>
    
              )}
            />
    
            <FlatList
              data={recentChats}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
    
                <View style={styles.chatItem}>
                  <View style={styles.chatAvatar} />
                    <View style={styles.chatInfo}>
                        <Text style={styles.chatName}>{item.name}</Text>
                        <Text style={styles.chatMessage}>{item.message}</Text>
                    </View>
                    <Text style={styles.chatTime}>{item.time}</Text>
                </View>
                
              )}
            />
    
            <FlatList
              data={recentChats}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
    
                <View style={styles.chatItem}>
                  <View style={styles.chatAvatar} />
                    <View style={styles.chatInfo}>
                        <Text style={styles.chatName}>{item.name}</Text>
                        <Text style={styles.chatMessage}>{item.message}</Text>
                    </View>
                    <Text style={styles.chatTime}>{item.time}</Text>
                </View>
                
              )}
            />
    
          </View>
    
        </View>
      );

}

export default ChatScreen;

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