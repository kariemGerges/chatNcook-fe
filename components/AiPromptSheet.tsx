import React, { forwardRef, useState, useMemo, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { getCookingAdviceGemini } from '@/utils/gemini';

export const AiPromptSheet = forwardRef<BottomSheet>((_, ref) => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    // ✅ FIX: wrap snapPoints in useMemo
    const snapPoints = useMemo(() => ['50%'], []);

    const sendPrompt = async () => {
        const result = await getCookingAdviceGemini(prompt);
        setResponse(result || 'No response from ChatNCook.');
    };

    useEffect(() => {
        console.log('[Sheet] mounted, ref =', ref);
    }, []);

    return (
        <BottomSheet
            ref={ref}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose
            backgroundStyle={{ borderRadius: 24 }}
        >
            <View style={styles.content}>
                <Text style={styles.label}>Ask the ChatNCook 🤖</Text>
                <TextInput
                    value={prompt}
                    onChangeText={setPrompt}
                    placeholder="e.g. Replace butter with..."
                    style={styles.input}
                />
                <Button title="Send" onPress={sendPrompt} />
                {response && <Text style={styles.response}>{response}</Text>}
            </View>
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    content: { flex: 1, padding: 20 },
    label: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    response: {
        marginTop: 20,
        backgroundColor: '#FFF3E0',
        padding: 12,
        borderRadius: 10,
        fontSize: 14,
    },
});
