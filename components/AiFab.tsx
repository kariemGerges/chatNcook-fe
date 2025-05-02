import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

declare global {
    var askSheet: { present: () => void } | undefined;
}

interface Props {
    announce?: boolean;
}
export const AiFab: React.FC<Props> = ({ announce }) => {
    /* FAB grows / pulses when announce===true */
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!announce) return;
        Animated.loop(
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.2,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [announce]);

    return (
        <Pressable
            onPress={() => {
                Haptics.selectionAsync();
                globalThis.askSheet?.present(); // exposed by AskSheet below
            }}
            style={styles.container}
        >
            <Animated.View style={[styles.fab, { transform: [{ scale }] }]}>
                <MaterialCommunityIcons
                    name="robot-happy"
                    size={28}
                    color="white"
                />
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: { position: 'absolute', bottom: 24, right: 24, zIndex: 200 },
    fab: {
        backgroundColor: '#FF6B35',
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 6,
    },
});
