import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Easing,
    Dimensions,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import {
    Ionicons,
    MaterialCommunityIcons,
    FontAwesome5,
    Feather,
} from '@expo/vector-icons';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

interface ActionButtonProps {
    onNewChatPress: () => void;
    onNewRecipePress: () => void;
    onNewFriendPress: () => void;
    onHelpPress: () => void;
    onSettingsPress: () => void;
    onFavPress: () => void;
    onClose: () => void;
}

const WheelActionMenu = ({
    onNewChatPress,
    onNewRecipePress,
    onNewFriendPress,
    onHelpPress,
    onSettingsPress,
    onFavPress,
    onClose,
}: ActionButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;
    const backdropAnimation = useRef(new Animated.Value(0)).current;
    const rotationAnimation = useRef(new Animated.Value(0)).current;

    // Number of buttons in the wheel
    const numButtons = 6;

    // Generate angle for each button in the wheel
    const getButtonAngle = (index: number) => {
        // Calculate angles to form a half-circle on top
        return -Math.PI + (Math.PI * index) / (numButtons - 1);
    };

    // Position for buttons in the wheel
    const getButtonPosition = (index: number, radius: number) => {
        const angle = getButtonAngle(index);
        return {
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
        };
    };

    // Trigger animation when component mounts
    useEffect(() => {
        toggleMenu();
    }, []);

    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1;

        // Configure animation for smooth opening/closing
        LayoutAnimation.configureNext(
            LayoutAnimation.create(300, 'easeInEaseOut', 'opacity')
        );

        Animated.parallel([
            Animated.timing(animation, {
                toValue,
                duration: 500,
                easing: Easing.bezier(0.2, 1, 0.2, 1),
                useNativeDriver: true,
            }),
            Animated.timing(backdropAnimation, {
                toValue,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(rotationAnimation, {
                toValue: isOpen ? 0 : 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setIsOpen(!isOpen);
            if (isOpen) {
                onClose();
            }
        });
    };

    // Button press handlers with delays for smooth animation
    const handleButtonPress = (action: () => void) => {
        toggleMenu();
        setTimeout(() => action(), 300);
    };

    const mainButtonRotate = rotationAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '135deg'],
    });

    const mainButtonScale = animation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.2, 1],
    });

    // Generate button data
    const buttonData = [
        {
            icon: 'chatbubble-ellipses',
            iconProvider: Ionicons,
            color: '#4A6572',
            label: 'New Chat',
            onPress: onNewChatPress,
        },
        {
            icon: 'food',
            iconProvider: MaterialCommunityIcons,
            color: '#F9A826',
            label: 'New Recipe',
            onPress: onNewRecipePress,
        },
        {
            icon: 'book-open',
            iconProvider: Feather,
            color: '#4CAF50',
            label: 'Cookbook',
            onPress: onNewFriendPress,
        },
        {
            icon: 'star',
            iconProvider: FontAwesome5,
            color: '#9C27B0',
            label: 'Favorites',
            onPress: onFavPress,
        },
        {
            icon: 'cog',
            iconProvider: FontAwesome5,
            color: '#607D8B',
            label: 'Settings',
            onPress: onSettingsPress,
        },
        {
            icon: 'question-circle',
            iconProvider: FontAwesome5,
            color: '#2196F3',
            label: 'Help',
            onPress: onHelpPress,
        },
    ];

    return (
        <View style={styles.container}>
            {/* Wheel Menu */}
            <View style={styles.menuContainer}>
                {/* Action Buttons */}
                {buttonData.map((button, index) => {
                    const position = getButtonPosition(index, 120);

                    // Individual button animations
                    const buttonOpacity = animation.interpolate({
                        inputRange: [0, 0.7, 1],
                        outputRange: [0, 0, 1],
                    });

                    const buttonScale = animation.interpolate({
                        inputRange: [0, 0.7, 1],
                        outputRange: [0.3, 0.3, 1],
                    });

                    const buttonTranslateX = animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, position.x],
                    });

                    const buttonTranslateY = animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, position.y],
                    });

                    const IconComponent = button.iconProvider;

                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.actionButtonWrapper,
                                {
                                    opacity: buttonOpacity,
                                    transform: [
                                        { translateX: buttonTranslateX },
                                        { translateY: buttonTranslateY },
                                        { scale: buttonScale },
                                    ],
                                },
                            ]}
                        >
                            <TouchableOpacity
                                style={[
                                    styles.actionButton,
                                    { backgroundColor: button.color },
                                ]}
                                onPress={() =>
                                    handleButtonPress(button.onPress)
                                }
                            >
                                <IconComponent
                                    name={button.icon}
                                    size={22}
                                    color="#FFFFFF"
                                />
                            </TouchableOpacity>
                            <View style={styles.labelContainer}>
                                <Text style={styles.actionLabel}>
                                    {button.label}
                                </Text>
                            </View>
                        </Animated.View>
                    );
                })}

                {/* Main Button with pulse effect */}
                <Animated.View
                    style={[
                        styles.pulseRing,
                        {
                            opacity: animation,
                            transform: [
                                {
                                    scale: animation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1, 1.5],
                                    }),
                                },
                            ],
                        },
                    ]}
                />

                <Animated.View
                    style={{
                        transform: [
                            { rotate: mainButtonRotate },
                            { scale: mainButtonScale },
                        ],
                    }}
                >
                    <TouchableOpacity
                        style={styles.mainButton}
                        onPress={toggleMenu}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={30} color="#FFFFFF" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        zIndex: 999,
    },
    backdrop: {
        position: 'absolute',
        backgroundColor: '#000000',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        bottom: -30,
        left: -Dimensions.get('window').width / 2,
        zIndex: -1,
    },
    backdropTouchable: {
        width: '100%',
        height: '100%',
    },
    menuContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        height: 250,
        width: 250,
    },
    actionButtonWrapper: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    actionButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    labelContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        marginTop: 6,
    },
    actionLabel: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
    },
    mainButton: {
        width: 65,
        height: 65,
        borderRadius: 35,
        backgroundColor: '#FE724C',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FE724C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 20,
    },
    pulseRing: {
        position: 'absolute',
        width: 65,
        height: 65,
        borderRadius: 35,
        backgroundColor: 'rgba(254, 114, 76, 0.2)',
        zIndex: 0,
    },
});

export default WheelActionMenu;
