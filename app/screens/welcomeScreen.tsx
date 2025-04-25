import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Animated,
    Dimensions,
    StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const bubbleAnim1 = useRef(new Animated.Value(0)).current;
    const bubbleAnim2 = useRef(new Animated.Value(0)).current;
    const bubbleAnim3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Main content animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();

        // Chat bubble animations sequence
        Animated.sequence([
            Animated.timing(bubbleAnim1, {
                toValue: 1,
                duration: 500,
                delay: 400,
                useNativeDriver: true,
            }),
            Animated.timing(bubbleAnim2, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(bubbleAnim3, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleSignIn = () => {
        router.push('/screens/LoginScreen');
    };

    const handleSignUp = () => {
        router.push('/screens/SignupScreen');
    };

    const handleSkip = () => {
        router.push('/');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Skip button */}
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            {/* App Logo and Chat Bubbles */}
            <View style={styles.logoContainer}>
                <View style={styles.iconContainer}>
                    <Feather name="coffee" size={48} color="#FF6B35" />
                    <Animated.View
                        style={[styles.chatBubble1, { opacity: bubbleAnim1 }]}
                    >
                        <Text style={styles.bubbleText}>🍳</Text>
                    </Animated.View>
                    <Animated.View
                        style={[styles.chatBubble2, { opacity: bubbleAnim2 }]}
                    >
                        <Text style={styles.bubbleText}>🥗</Text>
                    </Animated.View>
                    <Animated.View
                        style={[styles.chatBubble3, { opacity: bubbleAnim3 }]}
                    >
                        <Text style={styles.bubbleText}>👨‍🍳</Text>
                    </Animated.View>
                </View>
                <Text style={styles.logoText}>Cook & Chat</Text>
            </View>

            {/* Main Content */}
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                <Text style={styles.title}>Your Kitchen Companion</Text>
                <Text style={styles.subtitle}>
                    Discover recipes, connect with friends, and share your
                    culinary creations with a community of food lovers
                </Text>

                <View style={styles.featureList}>
                    <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                            <Feather
                                name="book-open"
                                size={24}
                                color="#FF6B35"
                            />
                        </View>
                        <View style={styles.featureTextContainer}>
                            <Text style={styles.featureTitle}>
                                Discover Recipes
                            </Text>
                            <Text style={styles.featureDescription}>
                                Browse thousands of recipes from around the
                                world
                            </Text>
                        </View>
                    </View>

                    <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                            <Feather
                                name="message-square"
                                size={24}
                                color="#FF6B35"
                            />
                        </View>
                        <View style={styles.featureTextContainer}>
                            <Text style={styles.featureTitle}>
                                Chat with Friends
                            </Text>
                            <Text style={styles.featureDescription}>
                                Share recipes and tips with your friends
                            </Text>
                        </View>
                    </View>

                    <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                            <Feather name="users" size={24} color="#FF6B35" />
                        </View>
                        <View style={styles.featureTextContainer}>
                            <Text style={styles.featureTitle}>
                                Join the Community
                            </Text>
                            <Text style={styles.featureDescription}>
                                Share recipes and connect with food enthusiasts
                            </Text>
                        </View>
                    </View>
                </View>
            </Animated.View>

            {/* Auth Buttons */}
            <View style={styles.authContainer}>
                <TouchableOpacity
                    style={styles.signInButton}
                    onPress={handleSignIn}
                >
                    <Text style={styles.signInText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signUpButton}
                    onPress={handleSignUp}
                >
                    <Text style={styles.signUpText}>Create Account</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
    skipButton: {
        alignSelf: 'flex-end',
        padding: 16,
    },
    skipText: {
        color: '#888',
        fontSize: 16,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    iconContainer: {
        position: 'relative',
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatBubble1: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: '#FFF0EA',
        borderRadius: 14,
        padding: 8,
        borderWidth: 1,
        borderColor: '#FFD0BA',
    },
    chatBubble2: {
        position: 'absolute',
        bottom: 0,
        left: -15,
        backgroundColor: '#FFF0EA',
        borderRadius: 14,
        padding: 8,
        borderWidth: 1,
        borderColor: '#FFD0BA',
    },
    chatBubble3: {
        position: 'absolute',
        top: 10,
        left: -25,
        backgroundColor: '#FFF0EA',
        borderRadius: 14,
        padding: 8,
        borderWidth: 1,
        borderColor: '#FFD0BA',
    },
    bubbleText: {
        fontSize: 16,
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
    },
    content: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 22,
    },
    featureList: {
        width: '100%',
        gap: 24,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF0EA',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    authContainer: {
        width: '100%',
        paddingVertical: 24,
        gap: 16,
    },
    signInButton: {
        backgroundColor: '#FF6B35',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#FF6B35',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    signInText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
    signUpButton: {
        backgroundColor: '#FFF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF6B35',
    },
    signUpText: {
        color: '#FF6B35',
        fontSize: 18,
        fontWeight: '600',
    },
});
