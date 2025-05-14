import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
} from '@/store/thunks/friendThunks';
import { firestore } from '@/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { FriendRequest } from '@/assets/types/types';

const FriendRequestsScreen = () => {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state) => state.user.user);

    const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>(
        []
    );
    const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser?.uid) return;

        const userRef = doc(firestore, 'users', currentUser.uid);

        const unsubscribe = onSnapshot(
            userRef,
            (doc) => {
                if (doc.exists()) {
                    const userData = doc.data();

                    // Process received requests
                    const received = userData.friendRequests?.received || [];
                    setReceivedRequests(received);

                    // Process sent requests
                    const sent = userData.friendRequests?.sent || [];
                    setSentRequests(sent);
                }

                setLoading(false);
            },
            (error) => {
                console.error('Error fetching friend requests:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [currentUser]);

    const handleAcceptRequest = (requesterId: string) => {
        if (!currentUser?.uid || !requesterId) {
            console.error('Missing user IDs for accept request');
            return;
        }

        dispatch(acceptFriendRequest(currentUser.uid, requesterId))
            .then(() => {
                Alert.alert('Success', 'Friend request accepted');
            })
            .catch((error) => {
                Alert.alert(
                    'Error',
                    `Failed to accept friend request: ${error.message}`
                );
            });
    };

    const handleRejectRequest = (requesterId: string) => {
        if (!currentUser?.uid) return;

        dispatch(rejectFriendRequest(currentUser.uid, requesterId))
            .then(() => {
                Alert.alert('Success', 'Friend request rejected');
            })
            .catch((error) => {
                Alert.alert(
                    'Error',
                    `Failed to reject friend request: ${error.message}`
                );
            });
    };

    const handleCancelRequest = (targetUserId: string) => {
        if (!currentUser?.uid) return;

        dispatch(cancelFriendRequest(currentUser.uid, targetUserId))
            .then(() => {
                Alert.alert('Success', 'Friend request canceled');
            })
            .catch((error) => {
                Alert.alert(
                    'Error',
                    `Failed to cancel friend request: ${error.message}`
                );
            });
    };

    const renderReceivedRequestItem = ({ item }: { item: FriendRequest }) => {
        if (!item.from) return null;

        return (
            <View style={styles.requestItem}>
                <Image
                    source={
                        item.from.photoURL
                            ? { uri: item.from.photoURL }
                            : require('@/assets/images/24.jpg')
                    }
                    style={styles.avatar}
                />
                <View style={styles.requestInfo}>
                    <Text style={styles.requestName}>
                        {item.from.displayName}
                    </Text>
                    <Text style={styles.requestTime}>
                        {new Date(item.timestamp).toLocaleDateString()}
                    </Text>
                </View>
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.acceptButton]}
                        onPress={() =>
                            handleAcceptRequest(item.from?.id || item.userId)
                        }
                    >
                        <Text style={styles.actionButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.rejectButton]}
                        onPress={() => handleRejectRequest(item.userId)}
                    >
                        <Text style={styles.actionButtonText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderSentRequestItem = ({ item }: { item: FriendRequest }) => (
        <View style={styles.requestItem}>
            <Text style={styles.pendingText}>Pending request</Text>
            <View style={styles.requestInfo}>
                <Text style={styles.requestName}>User ID: {item.userId}</Text>
                <Text style={styles.requestTime}>
                    Sent on {new Date(item.timestamp).toLocaleDateString()}
                </Text>
            </View>
            <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => handleCancelRequest(item.userId)}
            >
                <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066cc" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Received Requests</Text>
                {receivedRequests.length > 0 ? (
                    <FlatList
                        data={receivedRequests}
                        renderItem={renderReceivedRequestItem}
                        keyExtractor={(item) => item.userId}
                        contentContainerStyle={styles.requestsList}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>
                            No pending friend requests
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sent Requests</Text>
                {sentRequests.length > 0 ? (
                    <FlatList
                        data={sentRequests}
                        renderItem={renderSentRequestItem}
                        keyExtractor={(item) => item.userId}
                        contentContainerStyle={styles.requestsList}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>
                            No pending outgoing requests
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    requestsList: {
        paddingBottom: 8,
    },
    requestItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
    },
    pendingText: {
        fontSize: 14,
        color: '#666',
        width: 40,
    },
    requestInfo: {
        flex: 1,
        marginLeft: 12,
    },
    requestName: {
        fontSize: 16,
        fontWeight: '500',
    },
    requestTime: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    actionButtons: {
        flexDirection: 'row',
    },
    actionButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginLeft: 8,
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
    },
    rejectButton: {
        backgroundColor: '#F44336',
    },
    cancelButton: {
        backgroundColor: '#F44336',
    },
    actionButtonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 14,
    },
    emptyState: {
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
    },
});

export default FriendRequestsScreen;
