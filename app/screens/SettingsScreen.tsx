import React from 'react';
import { View, Text } from 'react-native';


export default function HelpScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>Settings Screen</Text>
            <Text style={{ fontSize: 16 }}>This is the settings screen.</Text>
        </View>
    );
};
