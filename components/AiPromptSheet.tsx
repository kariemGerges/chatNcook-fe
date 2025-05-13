// import React, { forwardRef, useState, useMemo, useEffect } from 'react';
// import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
// import BottomSheet from '@gorhom/bottom-sheet';
// import { getCookingAdviceGemini } from '@/utils/gemini';

// export const AiPromptSheet = forwardRef<BottomSheet>((_, ref) => {
//     const [prompt, setPrompt] = useState('');
//     const [response, setResponse] = useState('');

//     // ✅ FIX: wrap snapPoints in useMemo
//     const snapPoints = useMemo(() => ['50%'], []);

//     const sendPrompt = async () => {
//         const result = await getCookingAdviceGemini(prompt);
//         setResponse(result || 'No response from ChatNCook.');
//     };

//     useEffect(() => {
//         console.log('[Sheet] mounted, ref =', ref);
//     }, []);

//     return (
//         <BottomSheet
//             ref={ref}
//             index={0}
//             snapPoints={snapPoints}
//             enablePanDownToClose
//             backgroundStyle={{ borderRadius: 24 }}
//         >
//             <View style={styles.content}>
//                 <Text style={styles.label}>Ask the ChatNCook 🤖</Text>
//                 <TextInput
//                     value={prompt}
//                     onChangeText={setPrompt}
//                     placeholder="e.g. Replace butter with..."
//                     style={styles.input}
//                 />
//                 <Button title="Send" onPress={sendPrompt} />
//                 {response && <Text style={styles.response}>{response}</Text>}
//             </View>
//         </BottomSheet>
//     );
// });

// const styles = StyleSheet.create({
//     content: { flex: 1, padding: 20 },
//     label: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
//     input: {
//         borderColor: '#ccc',
//         borderWidth: 1,
//         borderRadius: 12,
//         padding: 12,
//         marginBottom: 12,
//     },
//     response: {
//         marginTop: 20,
//         backgroundColor: '#FFF3E0',
//         padding: 12,
//         borderRadius: 10,
//         fontSize: 14,
//     },
// });
import React, { useState, useCallback } from 'react';
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    Text,
    Modal,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getCookingAdviceGemini } from '@/utils/gemini';

interface AiPromptSheetProps {
    isVisible: boolean;
    onClose: () => void;
}

export const AiPromptSheet = ({ isVisible, onClose }: AiPromptSheetProps) => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendPrompt = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        try {
            const result = await getCookingAdviceGemini(prompt);
            setResponse(result || 'No response from ChatNCook.');
        } catch (error) {
            console.error('Failed to get AI response:', error);
            setResponse('Sorry, something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.label}>Ask the ChatNCook 💬</Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <MaterialCommunityIcons
                                name="close"
                                size={24}
                                color="#333"
                            />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        value={prompt}
                        onChangeText={setPrompt}
                        placeholder="e.g. Replace butter with..."
                        style={styles.input}
                        multiline
                    />

                    <Button
                        title={isLoading ? 'Sending...' : 'Send'}
                        onPress={sendPrompt}
                        disabled={isLoading || !prompt.trim()}
                    />

                    {response ? (
                        <View style={styles.responseContainer}>
                            <Text style={styles.responseLabel}>
                                ChatNCook says:
                            </Text>
                            <Text style={styles.response}>{response}</Text>
                        </View>
                    ) : null}
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(238, 136, 41, 0.05)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '70%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    closeButton: {
        padding: 5,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
        minHeight: 60,
    },
    responseContainer: {
        marginTop: 20,
    },
    responseLabel: {
        fontWeight: '600',
        marginBottom: 5,
    },
    response: {
        backgroundColor: '#FFF3E0',
        padding: 12,
        borderRadius: 10,
        fontSize: 14,
    },
});
