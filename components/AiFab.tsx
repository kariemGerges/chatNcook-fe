// import React, { useEffect, useRef } from 'react';
// import {
//     Animated,
//     Pressable,
//     StyleSheet,
//     SafeAreaView,
//     Platform,
// } from 'react-native';
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
//                     Haptics.selectionAsync();
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
import { Animated, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const AiFab = ({ onPress }: { onPress: () => void }) => {
    const pulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {
                    toValue: 1.02,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulse, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);
    

    return (
        <Pressable style={styles.container} onPress={() => {
            onPress();
            console.log('FAB Pressed');
        }}>
            <Animated.View
                style={[styles.fab, { transform: [{ scale: pulse }] }]}
            >
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
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.25,
    },
});
