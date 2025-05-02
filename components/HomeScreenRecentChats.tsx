import { Chats } from '@/assets/types/types';
import {
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from '@expo/vector-icons';

import { useRef, useEffect } from 'react';
import {
    Animated,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
    View,
    Text,
    Dimensions,
} from 'react-native';

import { useRouter } from 'expo-router';

import { listenToUserChats } from '@/store/thunks/chatThunks';
import { selectRecentChatsVM } from '@/store/selectors/chatSelector';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';

const { width } = Dimensions.get('window');

export default function HomeScreenRecentChats() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    // Getting user data from Redux read slice
    const {
        user,
        profileData,
        loading: userLoading,
    } = useSelector((state: RootState) => state.user);

    // console.log('user', profileData?.name);
    //     console.log('user', profileData?.avatar);

    /* get recent (≤3), loading, error in one call */
    const { recent, loading, error } = useSelector(selectRecentChatsVM);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // using redux to listen to user chats real time
    useEffect(() => {
        if (userLoading) return; // wait until Firebase decides

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

    // Function to trim the last message to 20 characters
    function trimLastMessage(message: string): string {
        if (message.length > 20) {
            return message.substring(0, 20) + '...';
        }
        return message;
    }

    // kick off Entrance animation on mount
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const renderChatItem = ({
        item,
        index,
    }: {
        item: Chats;
        index: number;
    }) => (
        <Animated.View
            style={{
                margin: 10,
                opacity: fadeAnim,
                transform: [
                    {
                        translateX: slideAnim.interpolate({
                            inputRange: [0, 50],
                            outputRange: [0, 50 * (index + 1)],
                        }),
                    },
                ],
            }}
        >
            <TouchableOpacity
                onPress={() =>
                    router.push(`/screens/chatAndMessages/${item.id}`)
                }
                style={styles.chatCard}
                activeOpacity={0.7}
            >
                <View style={styles.chatItem}>
                    <View style={styles.chatIconContainer}>
                        <Image
                            source={
                                item.chatAvatar
                                    ? { uri: item.chatAvatar }
                                    : { uri: `https://via.placeholder.com/40` }
                            }
                            style={styles.chatAvatar}
                        />
                        {item.unreadCounts && <View style={styles.unreadDot} />}
                    </View>
                    <View style={styles.chatInfo}>
                        <Text style={styles.chatName}>{item.chatName}</Text>
                        <View style={styles.chatDetails}>
                            <MaterialIcons
                                name="chat-bubble-outline"
                                size={12}
                                color="#666"
                            />
                            <Text style={styles.chatMessage}>
                                {trimLastMessage(
                                    item.lastMessage
                                        ? item.lastMessage
                                        : 'No messages yet'
                                )}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.timeContainer}>
                        <MaterialIcons
                            name="access-time"
                            size={12}
                            color="#666"
                        />
                        <Text style={styles.chatTime}>
                            {formatLastUpdated(item.lastUpdated)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    const scrollY = useRef(new Animated.Value(0)).current;

    /* simple UI branches */
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Chats</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
            </View>
            <Animated.FlatList
                data={recent}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <Text style={styles.noChatsText}>No chats available</Text>
                }
                renderItem={renderChatItem}
                // style={styles.container}
                contentContainerStyle={styles.chatsList}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                horizontal
            />
        </View>
    );
}

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: '#D32F2F', fontSize: 16 },

    container: {
        flex: 1,
        backgroundColor: '#FFEBC6',
    },
    contentContainer: {
        paddingBottom: 20,
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
    chatsList: {
        paddingHorizontal: 16,
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
    chatIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#FE724C',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    chatAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
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
    noChatsText: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginTop: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
        marginTop: 20,
    
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        paddingHorizontal: 16,
        // marginBottom: 12,
    },
    chatCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginRight: 16,
        width: width * 0.75,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    chatInfo: {
        flex: 1,
    },
    chatName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 4,
    },
    chatDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chatMembers: {
        fontSize: 12,
        color: '#777777',
        marginRight: 12,
    },
    activeIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4CAF50',
        marginRight: 4,
    },
    activeText: {
        fontSize: 12,
        color: '#4CAF50',
    },
});
