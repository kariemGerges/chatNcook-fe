// import React, { useEffect, useRef } from 'react';
// import { StyleSheet, Pressable, SafeAreaView, Animated, Platform } from 'react-native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import * as Haptics from 'expo-haptics';

// declare global {
//     var askSheet: { present: () => void } | undefined;
// }

// interface Props {
//     announce?: boolean;
// }

// export const AiFab: React.FC<Props> = ({ announce }) => {
//     /* FAB grows / pulses when announce===true */
//     const scale = useRef(new Animated.Value(1)).current;

//     useEffect(() => {
//         if (!announce) return;
//         Animated.loop(
//             Animated.sequence([
//                 Animated.timing(scale, {
//                     toValue: 1.05,
//                     duration: 800,
//                     useNativeDriver: true,
//                 }),
//                 Animated.timing(scale, {
//                     toValue: 1,
//                     duration: 800,
//                     useNativeDriver: true,
//                 }),
//             ])
//         ).start();
//     }, [announce]);

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <Pressable
//                 onPress={() => {
                   
//                     globalThis.askSheet?.present(); // exposed by AskSheet below
//                 }}
//                 style={styles.container}
//             >
//                 <Animated.View style={[styles.fab, { transform: [{ scale }] }]}>
//                     <MaterialCommunityIcons
//                         name="robot-happy-outline"
//                         size={28}
//                         color="white"
//                     />
//                 </Animated.View>
//             </Pressable>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     safeArea: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         pointerEvents: 'box-none', // Allows touches to pass through to elements below
//         zIndex: 9999, // Very high zIndex to ensure it stays on top
//     },
//     container: {
//         position: 'absolute',
//         bottom: Platform.OS === 'ios' ? 24 : 24,
//         right: 24,
//         zIndex: 9999,
//         elevation: 10, // Higher elevation for Android
//     },
//     fab: {
//         backgroundColor: '#FF6B35',
//         width: 56,
//         height: 56,
//         borderRadius: 28,
//         alignItems: 'center',
//         justifyContent: 'center',
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 6,
//         elevation: 10, // Increased elevation for Android
//     },
// });

import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AiFabProps {
    onPress: () => void;
    announce?: boolean;
}

export const AiFab = ({ onPress, announce }: AiFabProps) => {
    const scale = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        if (!announce) return;
        Animated.loop(
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.05,
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
        <TouchableOpacity
            style={styles.fabContainer}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Animated.View style={[styles.fab, { transform: [{ scale }] }]}>
                <MaterialCommunityIcons
                    name="robot-happy-outline"
                    size={28}
                    color="white"
                />
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    // FAB styles
    fabContainer: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        zIndex: 9999,
    },
    fab: {
        backgroundColor: '#FF6B35',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
});
