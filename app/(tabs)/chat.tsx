import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    RefreshControl,
} from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState, AppDispatch } from '@/store';
import { listenToUserChats } from '@/store/thunks/chatThunks';
import { UserData } from '@/assets/types/types';
import SkeletonLoadingChatItem from '@/components/SkeletonLoadingItem';
import { COLORS } from '@/constants/Colors';
import { Header } from '@/components/Header';
import AddFriendBtn from '@/components/AddFriendBtn';

const ChatScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    // Getting user data from Redux read slice
    const {
        user,
        profileData,
        loading: userLoading,
        userError
    } = useSelector((state: RootState) => state.user);

    // Getting chat data from Redux
    const {
        chats,
        loading: chatsLoading,
        error: chatsError,
    } = useSelector((state: RootState) => state.chat);


    // Combined loading and error states
    const loading = userLoading || chatsLoading;
    const error = userError || chatsError;

    // using redux to listen to user chats real time
    useEffect(() => {
        if (loading) return; // wait until Firebase decides

        if (!user) {
            router.replace('/screens/LoginScreen');
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
    // const handleRetry = useCallback(() => {
    //   setRefreshing(true);
    //   try {
    //     refetchUser();
    //     if (user) {
    //       dispatch(listenToUserChats(user.uid));
    //     }
    //   } catch (error) {
    //     console.error('Retry failed:', error);
    //   } finally {
    //     setRefreshing(false);
    //   }
    // }, [refetchUser, dispatch, user]);

    // Function to navigate to [chat by id]
    const navigateToChat = useCallback(
        (chatId: string, profileData: UserData) => {
            router.push({
                pathname: `/screens/chatAndMessages/[chatId]` as const,
                params: {
                    chatId,
                    userName: profileData.name,
                    userAvatar: profileData.avatar,
                    userUid: profileData.uid,
                    userStatus: profileData.status,
                },
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
            return 'Invalid timestamp';
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
                <Text style={styles.errorTitle}>
                    Oops! Something went wrong
                </Text>
                <Text style={styles.errorMessage}>
                    {error || 'Unable to load data'}
                </Text>
                <TouchableOpacity style={styles.retryButton}>
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
            <Header />

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
                            // onRefresh={handleRetry}
                            colors={['#FF9800', '#F57C00']}
                            tintColor="#FF9800"
                        />
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() =>
                                navigateToChat(item.id, profileData!)
                            }
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
                                        <View
                                            style={styles.placeholderAvatar}
                                        />
                                    )}
                                </View>
                                <View style={styles.chatInfo}>
                                    <Text
                                        style={styles.chatName}
                                        numberOfLines={1}
                                    >
                                        {item.chatName}
                                    </Text>
                                    <Text
                                        style={styles.chatMessage}
                                        numberOfLines={1}
                                    >
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
                        <Text style={styles.noChatsText}>
                            No chats available
                        </Text>
                    }
                />
            </View>
            <AddFriendBtn
                buttonText="➕"
                buttonColor="#e74c3c"
            />
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
    },
});
