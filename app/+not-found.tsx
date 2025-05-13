import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated,
    Easing,
} from 'react-native';
import { Link, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


const NotFoundScreen: React.FC = () => {
    const router = useRouter();

    const [currentJoke, setCurrentJoke] = useState(0);
    const bounceAnim = new Animated.Value(0);
    const rotateAnim = new Animated.Value(0);

    const cookingJokes = [
        'Looks like this recipe has gone missing... probably because it was so good someone ate the page!',
        "404: Recipe not found. Even our kitchen robot couldn't cook this one up!",
        'Oops! This page has been whisked away to another kitchen.',
        "This page has burnt to a crisp. We should've set a timer!",
        'This recipe seems to have fallen between the cracks... of our digital cookbook.',
    ];

    useEffect(() => {
        // Start animations
        startBounceAnimation();
        startRotateAnimation();

        // Rotate through jokes every 5 seconds
        const jokeInterval = setInterval(() => {
            setCurrentJoke((prev) => (prev + 1) % cookingJokes.length);
        }, 5000);

        return () => clearInterval(jokeInterval);
    }, []);

    const startBounceAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: -30,
                    duration: 800,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 800,
                    easing: Easing.bounce,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const startRotateAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 2500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 0,
                    duration: 2500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const goToHome = () => {
        // navigation.navigate('RecipeList' as never);
        router.push('/' as never);
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.errorCode}>404</Text>

                {/* Using Ionicons instead of an image */}
                <Animated.View
                    style={[
                        styles.iconContainer,
                        { transform: [{ translateY: bounceAnim }] },
                    ]}
                >
                    <Ionicons name="sad" size={120} color="#ff6b6b" />
                </Animated.View>

                <Text style={styles.errorTitle}>Recipe Not Found!</Text>
                <Text style={styles.errorMessage}>
                    {cookingJokes[currentJoke]}
                </Text>

                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructionsTitle}>How to fix:</Text>
                    <View style={styles.instructionItem}>
                        <Ionicons
                            name="restaurant-outline"
                            size={24}
                            color="#4CAF50"
                        />
                        <Text style={styles.instructionText}>
                            Check that the URL isn't half-baked
                        </Text>
                    </View>
                    <View style={styles.instructionItem}>
                        <Ionicons
                            name="book-outline"
                            size={24}
                            color="#4CAF50"
                        />
                        <Text style={styles.instructionText}>
                            Return to our menu of delicious recipes
                        </Text>
                    </View>
                    <View style={styles.instructionItem}>
                        <Ionicons
                            name="search-outline"
                            size={24}
                            color="#4CAF50"
                        />
                        <Text style={styles.instructionText}>
                            Try adding different ingredients to your search
                        </Text>
                    </View>
                </View>
                <Link href="/">
                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={goToHome}
                    >
                        <Text style={styles.homeButtonText}>
                            Back to Recipe Menu
                        </Text>
                        <Animated.View
                            style={{ transform: [{ rotate: spin }] }}
                        >
                            <Ionicons
                                name="restaurant"
                                size={24}
                                color="white"
                            />
                        </Animated.View>
                    </TouchableOpacity>
                </Link>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    "The secret ingredient is always love... and a valid URL."
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    errorCode: {
        fontSize: 80,
        fontWeight: 'bold',
        color: '#ff6b6b',
        marginBottom: 20,
    },
    iconContainer: {
        height: 150,
        width: 150,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    errorMessage: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    instructionsContainer: {
        alignSelf: 'stretch',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    instructionsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    instructionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    instructionText: {
        fontSize: 16,
        color: '#666',
        marginLeft: 10,
    },
    homeButton: {
        flexDirection: 'row',
        backgroundColor: '#ff6b6b',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    homeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginRight: 10,
    },
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        fontStyle: 'italic',
        color: '#888',
        textAlign: 'center',
    },
});

export default NotFoundScreen;
