import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Animated,
    Easing,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const CompactFoodCardLoading = () => {
    // Text animation state
    const [dots, setDots] = useState('');

    // Animation values
    const pulseAnim = useRef(new Animated.Value(0)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.97)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const bounceAnim = useRef(new Animated.Value(0)).current;

    // Start animations
    useEffect(() => {
        // Pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: false,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: false,
                }),
            ])
        ).start();

        // Shimmer effect
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1600,
                easing: Easing.linear,
                useNativeDriver: false,
            })
        ).start();

        // Subtle scale animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.02,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.97,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Icon rotation animation
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Bounce animation for text
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: -4,
                    duration: 500,
                    easing: Easing.sin,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 500,
                    easing: Easing.sin,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    // Dots animation
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => {
                if (prev.length >= 3) return '';
                return prev + '.';
            });
        }, 400);

        return () => clearInterval(interval);
    }, []);

    // Animation interpolations
    const pulseOpacity = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.7, 1],
    });

    const shimmerTranslateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-250, 250],
    });

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const borderColor = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255, 138, 101, 0.3)', 'rgba(255, 138, 101, 0.8)'],
    });

    interface ErrorBoundaryProps {
        children: React.ReactNode;
    }

    class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
        state = { hasError: false };

        static getDerivedStateFromError() {
            return { hasError: true };
        }

        render() {
            if (this.state.hasError) {
                return <Text>Loading...</Text>;
            }
            return this.props.children;
        }
    }

    return (
        <ErrorBoundary>
            <View style={styles.container}>
                <Animated.View
                    style={[
                        styles.foodCard,
                        {
                            transform: [{ scale: scaleAnim }],
                            borderColor: borderColor,
                        },
                    ]}
                >
                    {/* Food Image Skeleton - Smaller height */}
                    <View style={styles.imageContainer}>
                        <LinearGradient
                            colors={['#EAEAEA', '#F5F5F5', '#EAEAEA']}
                            style={styles.skeletonImage}
                        >
                            <Animated.View
                                style={[
                                    styles.shimmer,
                                    {
                                        transform: [
                                            { translateX: shimmerTranslateX },
                                        ],
                                    },
                                ]}
                            />
                            <Animated.View style={{ transform: [{ rotate }] }}>
                                <Ionicons
                                    name="restaurant-outline"
                                    size={28}
                                    color="#D0D0D0"
                                    style={styles.foodIcon}
                                />
                            </Animated.View>
                        </LinearGradient>
                    </View>

                    {/* Food Details Skeleton - More compact */}
                    <View style={styles.detailsContainer}>
                        {/* Title */}
                        <View style={styles.shimmerContainer}>
                            <Animated.View
                                style={[
                                    styles.shimmer,
                                    {
                                        transform: [
                                            { translateX: shimmerTranslateX },
                                        ],
                                    },
                                ]}
                            />
                            <View style={styles.skeletonTitle} />
                        </View>

                        {/* Description - Single line */}
                        <View style={styles.shimmerContainer}>
                            <Animated.View
                                style={[
                                    styles.shimmer,
                                    {
                                        transform: [
                                            { translateX: shimmerTranslateX },
                                        ],
                                    },
                                ]}
                            />
                            <View style={styles.skeletonDescription} />
                        </View>

                        {/* Price and Rating */}
                        <View style={styles.bottomRow}>
                            <Animated.View
                                style={[
                                    styles.pricePill,
                                    { opacity: pulseOpacity },
                                ]}
                            >
                                <View style={styles.shimmerContainer}>
                                    <Animated.View
                                        style={[
                                            styles.shimmer,
                                            {
                                                transform: [
                                                    {
                                                        translateX:
                                                            shimmerTranslateX,
                                                    },
                                                ],
                                            },
                                        ]}
                                    />
                                    <View style={styles.skeletonPrice} />
                                </View>
                            </Animated.View>

                            <View style={styles.ratingContainer}>
                                <Animated.View
                                    style={{
                                        transform: [{ translateY: bounceAnim }],
                                    }}
                                >
                                    <Ionicons
                                        name="star"
                                        size={14}
                                        color="#FFB74D"
                                    />
                                </Animated.View>
                                <View style={styles.shimmerContainer}>
                                    <Animated.View
                                        style={[
                                            styles.shimmer,
                                            {
                                                transform: [
                                                    {
                                                        translateX:
                                                            shimmerTranslateX,
                                                    },
                                                ],
                                            },
                                        ]}
                                    />
                                    <View style={styles.skeletonRating} />
                                </View>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View style={styles.loadingTextContainer}>
                    {['P', 'r', 'e', 'p', 'a', 'r', 'i', 'n', 'g'].map(
                        (letter, index) => {
                            const letterAnim = useRef(
                                new Animated.Value(0)
                            ).current;

                            useEffect(() => {
                                Animated.sequence([
                                    Animated.delay(index * 120),
                                    Animated.timing(letterAnim, {
                                        toValue: 1,
                                        duration: 1000,
                                        useNativeDriver: true,
                                    }),
                                ]).start();
                            }, []);

                            return (
                                <Animated.Text
                                    key={index}
                                    style={[
                                        styles.loadingText,
                                        {
                                            transform: [
                                                {
                                                    translateY:
                                                        letterAnim.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [
                                                                0, -4,
                                                            ],
                                                        }),
                                                },
                                            ],
                                        },
                                    ]}
                                >
                                    {letter}
                                </Animated.Text>
                            );
                        }
                    )}
                    <Text style={styles.loadingText}>{dots}</Text>
                </Animated.View>
            </View>
        </ErrorBoundary>
    );
};

export default CompactFoodCardLoading;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        padding: 10,
        alignItems: 'center',
    },
    foodCard: {
        width: width * 0.85, // More compact width
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 138, 101, 0.3)',
    },
    imageContainer: {
        width: '100%',
        height: 140, // Reduced height
        overflow: 'hidden',
    },
    skeletonImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    foodIcon: {
        opacity: 0.6,
    },
    detailsContainer: {
        padding: 12, // Reduced padding
    },
    shimmerContainer: {
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 6, // Reduced margin
        borderRadius: 4,
    },
    shimmer: {
        width: 60,
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        position: 'absolute',
        top: 0,
        zIndex: 1,
    },
    skeletonTitle: {
        width: '65%',
        height: 18, // Smaller height
        backgroundColor: '#ECECEC',
        borderRadius: 4,
        marginBottom: 4,
    },
    skeletonDescription: {
        width: '90%',
        height: 10, // Smaller height
        backgroundColor: '#F2F2F2',
        borderRadius: 4,
        marginBottom: 6,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6, // Reduced margin
    },
    pricePill: {
        backgroundColor: 'rgba(255, 138, 101, 0.1)',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    skeletonPrice: {
        width: 45,
        height: 16,
        backgroundColor: '#ECECEC',
        borderRadius: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    skeletonRating: {
        width: 25,
        height: 14,
        backgroundColor: '#F2F2F2',
        borderRadius: 4,
        marginLeft: 4,
    },
    loadingTextContainer: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    loadingText: {
        color: '#FF8A65',
        fontWeight: '500',
        fontSize: 14,
    },
});
