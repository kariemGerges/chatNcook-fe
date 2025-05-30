import React, { useState, useRef } from 'react';
import {
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    View,
    TextInput,
    Animated,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

interface Category {
    id: string;
    name: string;
    icon: string;
    active: boolean;
}

const DiscoverScreenCategories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([
        { id: '0', name: 'All', icon: 'apps', active: true },
        { id: '1', name: 'Italian', icon: 'pizza', active: false },
        { id: '2', name: 'Asian', icon: 'noodles', active: false },
        { id: '3', name: 'Desserts', icon: 'cake', active: false },
        { id: '4', name: 'Healthy', icon: 'leaf', active: false },
    ]);

    const scrollY = useRef(new Animated.Value(0)).current;

    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, 100], // distance over which the header will move
        outputRange: [0, -100], // from fully visible to fully hidden
        extrapolate: 'clamp',
    });

    // Toggle active state for categories
    const toggleCategoryActive = (id: string) => {
        setCategories(
            categories.map((category) =>
                category.id === id
                    ? { ...category, active: true }
                    : { ...category, active: false }
            )
        );
    };
    // Render category buttons component
    const renderCategoryButton = ({ item }: { item: Category }) => (
        <TouchableOpacity
            style={[
                styles.categoryButton,
                item.active && styles.categoryButtonActive,
            ]}
            onPress={() => toggleCategoryActive(item.id)}
        >
            <MaterialCommunityIcons
                name={item.icon as any}
                size={20}
                color={item.active ? '#FFFFFF' : '#555555'}
            />
            <Text
                style={[
                    styles.categoryButtonText,
                    item.active && styles.categoryButtonTextActive,
                ]}
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    );
    return (
        <Animated.View
            style={{ transform: [{ translateY: headerTranslateY }] }}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#777777" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search recipes, chats..."
                        placeholderTextColor="#999999"
                    />
                </View>
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons
                        name="options-outline"
                        size={20}
                        color="#333333"
                    />
                </TouchableOpacity>
            </View>

            {/* Categories */}
            <FlatList
                data={categories}
                renderItem={renderCategoryButton}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesList}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    categoriesList: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    categoryButtonActive: {
        backgroundColor: '#FE724C',
    },
    categoryButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555555',
        marginLeft: 6,
    },
    categoryButtonTextActive: {
        color: '#FFFFFF',
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 15,
        color: '#333333',
    },
    filterButton: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginLeft: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
});

export default DiscoverScreenCategories;
