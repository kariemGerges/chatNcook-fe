import BottomSheet from '@gorhom/bottom-sheet';

import React, { useCallback, useRef } from 'react';
import { View, Text } from 'react-native';

import { AiFab } from '@/components/AiFab';
import { AiPromptSheet } from '@/components/AiPromptSheet';

export default function TestScreen() {
    const sheetRef = useRef<BottomSheet>(null);

    const handleOpenSheet = useCallback(() => {
        console.log('FAB Pressed, trying to open sheet');
        console.log('Sheet ref status:', sheetRef.current);
        sheetRef.current?.expand?.();
    }, []);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#F8F8F8',
            }}
        >
            <Text style={{ fontSize: 20 }}>Test Screen</Text>
            <Text style={{ fontSize: 16 }}>This is the test screen.</Text>

            <AiPromptSheet ref={sheetRef} />

            <AiFab onPress={handleOpenSheet} />
        </View>
    );
}
