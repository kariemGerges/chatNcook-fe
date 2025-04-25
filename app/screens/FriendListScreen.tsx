import React, { useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchFriends } from '@/store/thunks/friendThunks';
import { selectFriends } from '@/store/selectors/friendSelectors';
import { FriendProfile } from '@/assets/types/types';
import { router } from 'expo-router';
import { UserData } from '@/assets/types/types';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const FriendsListScreen = () => {
    const dispatch = useAppDispatch();
    const friends = useAppSelector(selectFriends);
    const currentUser = useAppSelector((state) => state.user.user);

    // Getting user data from Redux read slice
    const { profileData } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        let unsubscribe: () => void;

        if (currentUser?.uid) {
            unsubscribe = dispatch(fetchFriends(currentUser.uid));
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [dispatch, currentUser]);

    const handleSearchPress = () => {
        router.push('/screens/FriendSearchScreen' as never);
    };

    const handleFriendPress = (friend: FriendProfile) => {
        // Navigate to chat or user profile
        // navigation.navigate('Chat', {
        //     userId: friend.id,
        //     name: friend.displayName,
        // } as never);

        // using router.push instead of navigation.navigate
        router.push(`/chat/${friend.id}` as never);
        // router.push(`/screens/UserProfileScreen/${friend.id}` as never);
    };

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

    const renderFriendItem = ({ item }: { item: FriendProfile }) => (
        <TouchableOpacity
            style={styles.friendItem}
            onPress={() => navigateToChat(item.id, profileData!)}
        >
            <Image
                source={
                    item.photoURL
                        ? { uri: item.photoURL }
                        : require('@/assets/images/24.jpg')
                }
                style={styles.avatar}
            />
            <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{item.displayName} {item.email }</Text>
                <Text style={styles.friendStatus}>
                    {item.status === 'online' ? 'Online' : 'Offline'}
                </Text>
            </View>
            <View
                style={[
                    styles.statusIndicator,
                    item.status === 'online'
                        ? styles.onlineIndicator
                        : styles.offlineIndicator,
                ]}
            />
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Friends Yet</Text>
            <Text style={styles.emptyStateText}>
                Search for friends by email or phone number to start chatting!
            </Text>
            <TouchableOpacity
                style={styles.findFriendsButton}
                onPress={handleSearchPress}
            >
                <Text style={styles.findFriendsButtonText}>Find Friends</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Friends</Text>
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearchPress}
                >
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={friends}
                renderItem={renderFriendItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={renderEmptyState}
                contentContainerStyle={styles.friendsList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchButton: {
        backgroundColor: '#0066cc',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
    searchButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    friendsList: {
        padding: 8,
        flexGrow: 1,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e0e0e0',
    },
    friendInfo: {
        flex: 1,
        marginLeft: 12,
    },
    friendName: {
        fontSize: 16,
        fontWeight: '600',
    },
    friendStatus: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginLeft: 8,
    },
    onlineIndicator: {
        backgroundColor: '#4CAF50',
    },
    offlineIndicator: {
        backgroundColor: '#9E9E9E',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        minHeight: 300,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    findFriendsButton: {
        backgroundColor: '#0066cc',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    findFriendsButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default FriendsListScreen;
