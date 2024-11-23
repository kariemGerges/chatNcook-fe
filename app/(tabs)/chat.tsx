import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { Href, useRouter } from 'expo-router';
import { RootState, AppDispatch } from '@/store';
import { listenToUserChats } from '@/store/chatThunks';
import { UserData } from '@/assets/types/types';
import useUserProfileData from '@/hooks/useUserProfileData';
import SkeletonLoadingChatItem  from '@/components/SkeletonLoadingItem';
import { COLORS } from '@/constants/Colors';

const ChatScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Getting user data using custom hook
  const {
    user,
    profileData,
    loading: userLoading,
    userError: userError,
    refetch: refetchUser,
  } = useUserProfileData();

  // Getting chat data from Redux
  const { chats, loading: chatsLoading, error: chatsError } = useSelector(
    (state: RootState) => state.chat
  );

  // Combined loading and error states
  const loading = userLoading || chatsLoading;
  const error = userError || chatsError;

  // using redux to listen to user chats real time
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/screens/LoginScreen');
      return;
    }

    if (user) {
      const userId = user.uid;

      const unsubscribeChats = dispatch(listenToUserChats(userId));

      return () => {
        if (unsubscribeChats) {
          unsubscribeChats();
        }
      };
    }
  }, [dispatch, user, userLoading, router]);

  // the retry refresh mechanism
  const handleRetry = useCallback(() => {
    setRefreshing(true);
    try {
      refetchUser();
      if (user) {
        dispatch(listenToUserChats(user.uid));
      }
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchUser, dispatch, user]);

  // Function to navigate to [chat by id]
  const navigateToChat = useCallback(
    (chatId: string, profileData: UserData) => {
      router.push({
        pathname: `/screens/chatAndMessages/[chatId]` as const,
        params : { 
            chatId,
            userName : profileData.name,
            userAvatar : profileData.avatar,
            userUid : profileData.uid,
            userStatus : profileData.status
        }

    });
    },
    [router]
  );

  // Function to format the last updated timestamp
  function formatLastUpdated(timestamp: number): string {
    try {
      const date = new Date(timestamp * 1000);
      const options: Intl.DateTimeFormatOptions = {
        year: '2-digit',
        month: 'short',
        day: 'numeric',
      };
      return date.toLocaleString('en-US', options);
    } catch (error) {
      return "Invalid timestamp";
    }
  }

   // Loading state handling in skeleton 
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.skeletonName} />
          <View style={styles.profileImageContainer} />
        </View>
        <View style={styles.recentChatsContainer}>
          <Text style={styles.recentChatsTitle}>Chats</Text>
          {[...Array(5)].map((_, index) => (
            <SkeletonLoadingChatItem key={index} />
          ))}
        </View>
      </View>
    );
  }

  // error handling and retry mechanism
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorMessage}>
          {error || 'Unable to load data'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      layout={Layout}
      style={styles.container}
    >
      {/* Header */}
      <LinearGradient
        colors={['#FFF4E0', '#FFEBC6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.name}>{profileData?.name}</Text>
          <TouchableOpacity style={styles.profileImageContainer}>
            {profileData?.avatar ? (
              <Image
                source={{ uri: profileData.avatar }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderAvatar} />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Recent Chats */}
      <View style={styles.recentChatsContainer}>
        <Text style={styles.recentChatsTitle}>Recent Chats</Text>

        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRetry}
              colors={['#FF9800', '#F57C00']}
              tintColor="#FF9800"
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => navigateToChat(item.id, profileData!)}
            >
              <Animated.View
                entering={FadeIn}
                layout={Layout}
                style={styles.chatItem}
              >
                <View style={styles.chatAvatarContainer}>
                  {item.chatAvatar ? (
                    <Image
                      source={{ uri: item.chatAvatar }}
                      style={styles.chatAvatar}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.placeholderAvatar} />
                  )}
                </View>
                <View style={styles.chatInfo}>
                  <Text style={styles.chatName} numberOfLines={1}>
                    {item.chatName}
                  </Text>
                  <Text style={styles.chatMessage} numberOfLines={1}>
                    {item.lastMessage || 'No messages yet'}
                  </Text>
                </View>
                <Text style={styles.chatTime}>
                  {formatLastUpdated(item.lastUpdated)}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.noChatsText}>No chats available</Text>
          }
        />
      </View>
    </Animated.View>
  );
};

export default ChatScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primary,
    flex: 1,   
    paddingLeft: 15,

  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: '#E0E0E0',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  recentChatsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  recentChatsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  chatAvatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  chatAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  chatMessage: {
    fontSize: 14,
    color: '#666666',
  },
  chatTime: {
    fontSize: 12,
    color: '#999999',
  },
  
  // Error and Skeleton Styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#D32F2F',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 3,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  skeletonAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  skeletonTitle: {
    width: 160,
    height: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonSubtitle: {
    width: 120,
    height: 14,
    borderRadius: 4,
  },
  skeletonName: {
    width: 100,
    height: 24,
    backgroundColor: '#E0E0E0',
  },
  noChatsText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
  placeholderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#E0E0E0',
  }
});






// import React, { useState, useCallback } from 'react';
// import { 
//   View, 
//   Text, 
//   Image, 
//   TouchableOpacity, 
//   StyleSheet, 
//   FlatList, 
//   ActivityIndicator, 
//   RefreshControl 
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Animated, { 
//   FadeIn, 
//   FadeOut, 
//   Layout 
// } from 'react-native-reanimated';
// import useUserProfileData from '@/hooks/useUserProfileData';
// import useUserChatFetcher from '@/hooks/useChatDataFetcher';
// import { Href, router } from 'expo-router';

// // Loading Skeleton with more refined design
// const SkeletonChatItem = () => (
//   <View style={styles.chatItem}>
//     <LinearGradient
//       colors={['#F5F5F5', '#FFFFFF', '#F5F5F5']}
//       style={styles.skeletonAvatar}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 0 }}
//     />
//     <View style={styles.chatInfo}>
//       <LinearGradient
//         colors={['#F0F0F0', '#FFFFFF', '#F0F0F0']}
//         style={styles.skeletonTitle}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//       />
//       <LinearGradient
//         colors={['#F0F0F0', '#FFFFFF', '#F0F0F0']}
//         style={styles.skeletonSubtitle}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//       />
//     </View>
//   </View>
// );

// const ChatScreen = () => {

//   const [refreshing, setRefreshing] = useState(false);

//   // Getting user data
//   const {
//     user, 
//     profileData, 
//     loading: userLoading, 
//     userError: userError, 
//     refetch: refetchUser 
//   } = useUserProfileData();

//   // Getting chat data
//   const { 
//     data, 
//     loading: loadingChats, 
//     error: errorChats, 
//     refetch: refetchChats 
//   } = useUserChatFetcher(user?.uid ?? null);

//   // Combined retry mechanism
//   const handleRetry = useCallback(async () => {
//     setRefreshing(true);
//     try {
//       await Promise.all([refetchUser(), refetchChats()]);
//     } catch (error) {
//       console.error('Retry failed:', error);
//     } finally {
//       setRefreshing(false);
//     }
//   }, [refetchUser, refetchChats]);

//   // Redirect to message screen
//   const navigateToChat = useCallback((chatId: string) => {
//     // Navigate to the specific chat screen
//     // router.push(`/components/chatAndMessages/${chatId}` as Href<string | object>);  
//     router.push(`/components/chatAndMessages/${chatId}` as Href<string | object>);

//     }, []);


//   // Redirect if no user
//   React.useEffect(() => {
//     if (!userLoading && !user) {
//       router.push('/screens/LoginScreen');
//     }
//   }, [user, userLoading, router]);

//   function formatLastUpdated(timestamp: number): string {
//     try {
//       const date = new Date(timestamp * 1000);
//       const options: Intl.DateTimeFormatOptions = {
//         year: '2-digit',
//         month: 'short',
//         day: 'numeric',
//       };
//       return date.toLocaleString('en-US', options);
//     } catch (error) {
//       return "Invalid timestamp";
//     }
//   }

//   // Error handling
//   if (userError || errorChats) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
//         <Text style={styles.errorMessage}>
//           {userError || errorChats || 'Unable to load data'}
//         </Text>
//         <TouchableOpacity 
//           style={styles.retryButton} 
//           onPress={handleRetry}
//         >
//           <Text style={styles.retryButtonText}>Try Again</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // Loading state
//   if (userLoading || loadingChats) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <View style={styles.skeletonName} />
//           <View style={styles.profileImageContainer} />
//         </View>
//         <View style={styles.recentChatsContainer}>
//           <Text style={styles.recentChatsTitle}>Chats</Text>
//           {[...Array(5)].map((_, index) => (
//             <SkeletonChatItem key={index} />
//           ))}
//         </View>
//       </View>
//     );
//   }


//   return (
//     <Animated.View 
//       entering={FadeIn} 
//       exiting={FadeOut} 
//       layout={Layout}
//       style={styles.container}
//     >
//       <LinearGradient
//         colors={['#FFF4E0', '#FFEBC6']}
//         style={styles.header}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//       >
//         <View style={styles.headerContent}>
//           <Text style={styles.name}>
//             {profileData?.name}
//           </Text>
//           <TouchableOpacity style={styles.profileImageContainer}>
//             <Image 
//               source={{ uri: profileData?.avatar }} 
//               style={styles.profileImage} 
//               resizeMode="cover"
//             />
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>

//       <View style={styles.recentChatsContainer}>
//         <Text style={styles.recentChatsTitle}>Recent Chats</Text>
        
//         <FlatList
//           data={data?.chats}
//           keyExtractor={(item) => item.id}
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={handleRetry}
//               colors={['#FF9800', '#F57C00']}
//               tintColor="#FF9800"
//             />
//           }
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               onPress={() => navigateToChat(item.id)}
//               >

//               <Animated.View 
//                 entering={FadeIn} 
//                 layout={Layout}
//                 style={styles.chatItem}
//               >
//                 <View style={styles.chatAvatarContainer}>
//                   <Image 
//                     source={{ uri: item.chatAvatar }} 
//                     style={styles.chatAvatar} 
//                     resizeMode="cover"
//                   />
//                 </View>
//                 <View style={styles.chatInfo}>
//                   <Text style={styles.chatName} numberOfLines={1}>
//                     {item.chatName}
//                   </Text>
//                   <Text style={styles.chatMessage} numberOfLines={1}>
//                     {item.lastMessage || 'No messages yet'}
//                   </Text>
//                 </View>
//                 <Text style={styles.chatTime}>
//                   {formatLastUpdated(item.lastUpdated)}
//                 </Text>
//               </Animated.View>

//             </TouchableOpacity>

//           )}
//         />
//       </View>
//     </Animated.View>
//   );
// };

// export default ChatScreen;

