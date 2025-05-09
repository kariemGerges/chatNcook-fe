
import React, { useEffect, useRef, useState, memo } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Animated,
    Dimensions,
    ActivityIndicator,
    Platform,
    StatusBar,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { Message } from '@/assets/types/types';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { MessagesSquare } from 'lucide-react';
import { COLORS } from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import { firestore } from '@/firebaseConfig';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { setMessages } from '@/store/slices/chatSlice';
import { Header } from '@/components/Header';

const { width, height } = Dimensions.get('window');

// Loading animation dots
const LoadingAnimation = () => {
    const dots = [
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
    ];

    useEffect(() => {
        const animations = dots.map((dot, index) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(index * 200),
                    Animated.spring(dot, {
                        toValue: 1,
                        useNativeDriver: true,
                        friction: 3,
                    }),
                    Animated.spring(dot, {
                        toValue: 0,
                        useNativeDriver: true,
                        friction: 3,
                    }),
                ])
            )
        );

        const animationSubscriptions = animations.map((anim) => anim.start());
        return () => {
            animations.forEach((anim) => anim.stop());
        };
    }, []);

    return (
        <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading Messages</Text>
            <View style={styles.dotsContainer}>
                {dots.map((dot, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                transform: [
                                    {
                                        scale: dot.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [1, 1.5],
                                        }),
                                    },
                                ],
                                opacity: dot.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.3, 1],
                                }),
                            },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

// Message Status not working yet
const MessageStatus = ({
    status,
}: {
    status: 'sending' | 'sent' | 'delivered' | 'read';
}) => {
    const getStatusIcon = () => {
        switch (status) {
            case 'sending':
                return (
                    <ActivityIndicator size="small" color={COLORS.loading} />
                );
            case 'sent':
                return (
                    <MaterialCommunityIcons
                        name="check"
                        size={16}
                        color={COLORS.sent}
                    />
                );
            case 'delivered':
                return (
                    <MaterialCommunityIcons
                        name="check-all"
                        size={16}
                        color={COLORS.sent}
                    />
                );
            case 'read':
                return (
                    <MaterialCommunityIcons
                        name="check-all"
                        size={16}
                        color={COLORS.success}
                    />
                );
        }
    };

    return <View style={styles.messageStatus}>{getStatusIcon()}</View>;
};

// Function to format the last updated timestamp
function formatLastUpdated(timestamp: number): string {
    try {
        const date = new Date(timestamp * 1);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return date.toLocaleString('en-US', options);
    } catch (error) {
        return 'Invalid timestamp';
    }
}

// if not text in message
const NoMessage = memo(({ messages }: { messages: Message[] }) => (
    <View>
        {messages.map((message: { text: any }) => message.text).length === 0 ? (
            <View style={styles.noMessageContainer}>
                <MessagesSquare
                    style={styles.noMessagesIcon}
                    size={50}
                    color={COLORS.lightText}
                />
                <Text style={styles.noMessagesText}>No messages yet</Text>
            </View>
        ) : null}
    </View>
));

const ChatDetailScreen = () => {
    const { chatId, userName, userAvatar, userUid, userStatus } =
        useLocalSearchParams<{
            chatId: string;
            userName: string;
            userAvatar: string;
            userUid: string;
            userStatus: string;
        }>();

    const dispatch = useDispatch();
    const messages: Message[] =
        useSelector((state: RootState) => state.chat.messages[chatId]) ?? [];
    const [inputMessage, setInputMessage] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const listRef = useRef<FlatList>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const messageAnimations = useRef<{ [key: string]: Animated.Value }>(
        {}
    ).current;

    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            'keyboardWillShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
            }
        );
        const hideSubscription = Keyboard.addListener(
            'keyboardWillHide',
            () => {
                setKeyboardHeight(0);
            }
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    // ────────────────────────────────────────────────────────
    // 1) Firestore listener: populate redux with real messages
    // ────────────────────────────────────────────────────────
    useEffect(() => {
        const q = query(
            collection(firestore, 'chats', chatId, 'messages'),
            orderBy('createdAt', 'asc')
        );
        const unsub = onSnapshot(q, (snap) => {
            const msgs = snap.docs.map((doc) => {
                const data = doc.data() as any;
                return {
                    id: doc.id,
                    ...data,
                    createdAt:
                        typeof data.createdAt?.toMillis === 'function'
                            ? data.createdAt.toMillis()
                            : data.createdAt,
                } as Message;
            });
            dispatch(setMessages({ chatId, messages: msgs }));
        });
        return () => unsub();
    }, [chatId, dispatch]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        // Prepare animations for messages
        messages?.forEach((message, index) => {
            if (!messageAnimations[message.id]) {
                messageAnimations[message.id] = new Animated.Value(0);
                Animated.sequence([
                    Animated.delay(index * 100),
                    Animated.spring(messageAnimations[message.id], {
                        toValue: 1,
                        tension: 40,
                        friction: 8,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        });
    }, [messages]);

    // message item component
    const renderMessageItem = ({
        item,
        index,
    }: {
        item: Message;
        index: number;
    }) => {
        const isMyMessage = item.senderId === userUid;
        const messageAnim = messageAnimations[item.id] || new Animated.Value(1);

        return (
            <Animated.View
                style={[
                    styles.messageContainer,
                    isMyMessage ? styles.myMessage : styles.otherMessage,
                    {
                        opacity: messageAnim,
                        transform: [
                            {
                                translateY: messageAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [50, 0],
                                }),
                            },
                            {
                                scale: messageAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.8, 1],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <View
                    style={[
                        styles.messageContent,
                        isMyMessage
                            ? styles.myMessageContent
                            : styles.otherMessageContent,
                    ]}
                >
                    <Text
                        style={[
                            styles.messageText,
                            isMyMessage
                                ? styles.myMessageText
                                : styles.otherMessageText,
                        ]}
                    >
                        {item.text}
                    </Text>
                    <View style={styles.messageFooter}>
                        <Text style={styles.timeText}>
                            {formatLastUpdated(item.createdAt)}
                        </Text>
                        {isMyMessage && (
                            <MessageStatus
                                status={item.deliveryStatus as 'sent'}
                            />
                        )}
                    </View>
                </View>
            </Animated.View>
        );
    };

    // Function to handle sending a message
    const handleSend = async () => {
        if (inputMessage.trim()) {
            try {
                const messagesCollection = collection(
                    firestore,
                    'chats',
                    chatId,
                    'messages'
                );

                // create a new message object
                const message: Message = {
                    id: '',
                    createdAt: Date.now(),
                    deleted: false,
                    imageUrl: '',
                    readBy: [],
                    system: false,
                    text: inputMessage,
                    type: 'text',
                    user: {
                        avatar: userAvatar,
                        name: userName,
                        uid: '',
                    },
                    senderId: '',
                    edited: false,
                    editedAt: null,
                    reactions: [],
                    replyTo: null,
                    attachments: [],
                    seenBy: [],
                    priority: 'low',
                    deliveryStatus: '',
                };

                const docRef = await addDoc(messagesCollection, {
                    ...message,
                    createdAt: serverTimestamp(),
                });
                await updateDoc(docRef, { id: docRef.id });
                console.log(`Message sent with ID: ${docRef.id}`);
            } catch (error) {
                console.error('Error sending message:', error);
            }

            // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setInputMessage('');
        }
    };

    // const NoMessage = () => (
    //     <View style={styles.noMessageContainer}>
    //         <MessagesSquare size={50} color={COLORS.lightText} />
    //         <Text style={styles.noMessagesText}>No messages yet</Text>
    //     </View>
    // );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
            {/* header */}
            <Header />

            <StatusBar barStyle="dark-content" />

            {/* message list */}
            <Animated.View
                style={[styles.contentContainer, { opacity: fadeAnim }]}
            >
                <FlatList
                    ref={listRef}
                    data={messages}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    renderItem={renderMessageItem}
                    inverted
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={() => (
                        <View style={styles.noMessageContainer}>
                            <Ionicons
                                name="chatbubble-outline"
                                size={50}
                                color={COLORS.lightText}
                            />
                            <Text style={styles.noMessagesText}>
                                No messages yet
                            </Text>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    onEndReachedThreshold={0.1}
                />
            </Animated.View>

            {/* input container */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputMessage}
                    onChangeText={setInputMessage}
                    placeholder="Type a message..."
                    placeholderTextColor={COLORS.lightText}
                    multiline
                />
                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        !inputMessage.trim() && styles.sendButtonDisabled,
                    ]}
                    onPress={handleSend}
                    disabled={!inputMessage.trim()}
                >
                    <MaterialCommunityIcons
                        name="send"
                        size={24}
                        color={COLORS.background}
                    />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    // header styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: 35,
        backgroundColor: '#FFEBC6',
        borderBottomWidth: 4,
        borderBottomColor: COLORS.background,
        borderRadius: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        fontFamily: 'helvetica',
        paddingLeft: 15,
    },
    profileImageContainer: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: '#E0E0E0',
        marginLeft: 'auto',
        marginRight: 10,
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    // no messages styles
    noMessagesText: {
        fontSize: 18,
        color: COLORS.lightText,
        textAlign: 'center',
        marginTop: 5,
        fontFamily: 'helvetica',
    },
    noMessageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noMessagesIcon: {
        fontSize: 18,
        color: '#666666',
        textAlign: 'center',
        marginTop: 190,
    },
    //
    contentContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    loadingText: {
        fontSize: 18,
        color: COLORS.primary,
        fontWeight: '600',
        marginBottom: 20,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary,
        marginHorizontal: 5,
    },
    messageContainer: {
        marginVertical: 4,
        maxWidth: width * 0.75,
    },
    messageContent: {
        borderRadius: 20,
        padding: 12,
        minHeight: 40,
    },
    myMessage: {
        alignSelf: 'flex-end',
    },
    otherMessage: {
        alignSelf: 'flex-start',
    },
    myMessageContent: {
        backgroundColor: COLORS.primary,
        borderTopRightRadius: 4,
    },
    otherMessageContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    myMessageText: {
        color: '#FFFFFF',
    },
    otherMessageText: {
        color: COLORS.text,
    },
    messageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 4,
    },
    timeText: {
        fontSize: 12,
        color: COLORS.lightText,
        marginRight: 4,
    },
    messageStatus: {
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.background,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        fontSize: 16,
        color: COLORS.text,
        maxHeight: 100,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: COLORS.lightText,
    },
    listContent: {
        paddingVertical: 16,
    },
});

export default ChatDetailScreen;

