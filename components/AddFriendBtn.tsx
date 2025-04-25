// components/BottomLeftMenu.tsx
import React, { useState } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    Animated,
} from 'react-native';
import { router } from 'expo-router';
import { BottomLeftMenuProps, MenuOption } from '@/assets/types/types';


const BottomLeftMenu: React.FC<BottomLeftMenuProps> = ({
    buttonColor = '#3498db',
    iconName = '+',
}) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [animation] = useState(new Animated.Value(0));

    const menuOptions: MenuOption[] = [
        { label: 'Add Friend', route: '/screens/FriendSearchScreen', color: '#e74c3c' },
        { label: 'Friends', route: '/screens/FriendListScreen', color: '#2ecc71' },
    ];

    const toggleMenu = () => {
        const toValue = menuVisible ? 0 : 1;

        Animated.spring(animation, {
            toValue,
            friction: 6,
            useNativeDriver: true,
        }).start();

        setMenuVisible(!menuVisible);
    };

    const navigateTo = (route: string) => {
        // Close the menu
        toggleMenu();

        // Navigate after a small delay to allow the animation to complete
        setTimeout(() => {
            router.push(route);
        }, 300);
    };

    return (
        <View style={styles.container}>
            {/* Menu Options */}
            {menuOptions.map((option, index) => {
                const translateY = animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -60 * (index + 1)],
                });

                const opacity = animation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0, 1],
                });

                return (
                    <Animated.View
                        key={option.label}
                        style={[
                            styles.menuOption,
                            { transform: [{ translateY }], opacity },
                        ]}
                    >
                        <TouchableOpacity
                            style={[
                                styles.optionButton,
                                { backgroundColor: option.color },
                            ]}
                            onPress={() => navigateTo(option.route)}
                        >
                            <Text style={styles.menuText}>{option.label}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                );
            })}

            {/* Main Button */}
            <TouchableOpacity
                style={[styles.mainButton, { backgroundColor: buttonColor }]}
                onPress={toggleMenu}
            >
                <Text style={styles.iconText}>{iconName}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        alignItems: 'center',
        zIndex: 999,
    },
    mainButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // animationDirection: 'down',
    },
    iconText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    menuOption: {
        position: 'absolute',
        bottom: 0,
        width: 120,
        left: -59, // Center the wider option buttons above the main button
    },
    optionButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    menuText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default BottomLeftMenu;
