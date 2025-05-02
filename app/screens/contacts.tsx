import React from 'react';
import { Text, View } from 'react-native';

export default function Contacts() {
    return (
        <View>
            <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 50 }}>
                Contacts Screen
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 20 }}>
                This is the contacts screen.
            </Text>
        </View>
    );
}
