import React, { forwardRef, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useAppDispatch } from '@/store/hooks';
// import { getAi } from '@/store/slices/aiSlice';

export const AskSheet = forwardRef<BottomSheet>((_, ref) => {
    const [prompt, setPrompt] = useState('');
    const dispatch = useAppDispatch();
    const presets = [
        'Substitute 2 eggs',
        'Scale this recipe to 8 servings',
        '7-day meal plan – high-protein, dairy-free',
    ];

    return (
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={['55%']}
            enablePanDownToClose
            backgroundStyle={{ borderRadius: 24 }}
        >
            <View style={styles.content}>
                <Text style={styles.label}>Ask the kitchen-AI 🤖</Text>
                <TextInput
                    value={prompt}
                    onChangeText={setPrompt}
                    placeholder="e.g. Replace heavy cream ..."
                    style={styles.input}
                />
                <Button
                    title="Send"
                    onPress={() => {
                        // dispatch(getAi(prompt));
                        setPrompt('');
                    }}
                />
                <View style={styles.chipsRow}>
                    {presets.map((p) => (
                        <Text
                            key={p}
                            style={styles.chip}
                            onPress={() => {
                                setPrompt(p);
                            }}
                        >
                            {p}
                        </Text>
                    ))}
                </View>
            </View>
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    content: { flex: 1, padding: 24, gap: 16 },
    label: { fontSize: 18, fontWeight: '600' },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 12,
    },
    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
        backgroundColor: '#FFD0BA',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        fontSize: 12,
    },
});
