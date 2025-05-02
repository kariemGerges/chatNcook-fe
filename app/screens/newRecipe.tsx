import React from 'react';
import { Text, View } from 'react-native';

export default function newRecipe() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>New Recipe Screen</Text>
            <Text style={{ fontSize: 16 }}>This is the new recipe screen.</Text>
        </View>
    );
}
