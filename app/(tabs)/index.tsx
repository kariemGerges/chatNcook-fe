import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    StatusBar,
    TextInput,
    Dimensions,
} from 'react-native';
import {
    Ionicons,
    MaterialCommunityIcons,
    FontAwesome5,
} from '@expo/vector-icons';
// import components
import { Header } from '@/components/Header';
import HomeScreenRecipeCard from '@/components/HomeScreenRecipeCard';
import HomeScreenRecentRecipeCard from '@/components/HomeScreenRecentRecipeCard';

const { width } = Dimensions.get('window');

// Types
interface Recipe {
    id: string;
    title: string;
    chef: string;
    chefAvatar: string;
    imageUrl: string;
    duration: string;
    likes: number;
    saved: boolean;
}

interface Category {
    id: string;
    name: string;
    icon: string;
    active: boolean;
}

export default function HomeScreen() {
    const [categories, setCategories] = useState<Category[]>([
        { id: '0', name: 'All', icon: 'apps', active: true },
        { id: '1', name: 'Italian', icon: 'pizza', active: false },
        { id: '2', name: 'Asian', icon: 'noodles', active: false },
        { id: '3', name: 'Desserts', icon: 'cake', active: false },
        { id: '4', name: 'Healthy', icon: 'leaf', active: false },
    ]);

    const [trendingRecipes, setTrendingRecipes] = useState<Recipe[]>([
        {
            id: '1',
            title: 'Spaghetti Carbonara',
            chef: 'Maria Garcia',
            chefAvatar: 'https://via.placeholder.com/40',
            imageUrl: 'https://via.placeholder.com/400x250',
            duration: '25 min',
            likes: 1243,
            saved: true,
        },
        {
            id: '2',
            title: 'Teriyaki Salmon Bowl',
            chef: 'Alex Wong',
            chefAvatar: 'https://via.placeholder.com/40',
            imageUrl: 'https://via.placeholder.com/400x250',
            duration: '35 min',
            likes: 892,
            saved: false,
        },
    ]);

    const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([
        {
            id: '3',
            title: 'Avocado Toast',
            chef: 'Emma Smith',
            chefAvatar: 'https://via.placeholder.com/40',
            imageUrl: 'https://via.placeholder.com/150x100',
            duration: '10 min',
            likes: 432,
            saved: false,
        },
        {
            id: '4',
            title: 'Greek Salad',
            chef: 'Peter Johnson',
            chefAvatar: 'https://via.placeholder.com/40',
            imageUrl: 'https://via.placeholder.com/150x100',
            duration: '15 min',
            likes: 345,
            saved: true,
        },
        {
            id: '5',
            title: 'Mushroom Risotto',
            chef: 'Sophie Lee',
            chefAvatar: 'https://via.placeholder.com/40',
            imageUrl: 'https://via.placeholder.com/150x100',
            duration: '40 min',
            likes: 578,
            saved: false,
        },
        {
            id: '6',
            title: 'Chocolate Mousse',
            chef: 'Jean Pierre',
            chefAvatar: 'https://via.placeholder.com/40',
            imageUrl: 'https://via.placeholder.com/150x100',
            duration: '50 min',
            likes: 789,
            saved: false,
        },
    ]);

    const activeChats = [
        {
            id: '1',
            name: 'Pasta Lovers',
            members: 5,
            active: true,
        },
        {
            id: '2',
            name: 'Vegan Cooking',
            members: 3,
            active: true,
        },
    ];

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

    // Toggle saved state for recipes
    const toggleSaved = (id: string) => {
        setTrendingRecipes(
            trendingRecipes.map((recipe) =>
                recipe.id === id ? { ...recipe, saved: !recipe.saved } : recipe
            )
        );
        setRecentRecipes(
            recentRecipes.map((recipe) =>
                recipe.id === id ? { ...recipe, saved: !recipe.saved } : recipe
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

    // Render active chat card component
    const renderActiveChat = ({
        item,
    }: {
        item: { id: string; name: string; members: number; active: boolean };
    }) => (
        <TouchableOpacity style={styles.chatCard}>
            <View style={styles.chatIconContainer}>
                <MaterialCommunityIcons name="chat" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{item.name}</Text>
                <View style={styles.chatDetails}>
                    <Text style={styles.chatMembers}>
                        {item.members} members
                    </Text>
                    <View style={styles.activeIndicator}>
                        <View style={styles.activeDot} />
                        <Text style={styles.activeText}>Active now</Text>
                    </View>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#777777" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <Header />

            {/* Main Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
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
                <Text style={styles.sectionTitle}>Categories</Text>
                <FlatList
                    data={categories}
                    renderItem={renderCategoryButton}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesList}
                />

                {/* Trending Recipes */}
                <HomeScreenRecipeCard toggleSaved={toggleSaved} />

                {/* Active Chats */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Active Chats</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={activeChats}
                    renderItem={renderActiveChat}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chatsList}
                />

                {/* Recent Recipes */}
                <HomeScreenRecentRecipeCard toggleSaved={toggleSaved} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    greeting: {
        fontSize: 14,
        color: '#777777',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 8,
        marginRight: 8,
    },
    profileButton: {
        padding: 0,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    content: {
        flex: 1,
        paddingTop: 8,
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
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    seeAllText: {
        fontSize: 14,
        color: '#FE724C',
    },
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
    trendingList: {
        paddingHorizontal: 16,
    },
    trendingCard: {
        width: width * 0.75,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    trendingImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    saveButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 8,
        padding: 6,
    },
    trendingInfo: {
        padding: 14,
    },
    trendingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
    },
    recipeDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chefContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chefAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    chefName: {
        fontSize: 12,
        color: '#777777',
        marginLeft: 6,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    statText: {
        fontSize: 12,
        color: '#777777',
        marginLeft: 4,
    },
    chatsList: {
        paddingHorizontal: 16,
    },
    chatCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginRight: 16,
        width: width * 0.75,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    chatIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#FE724C',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    chatInfo: {
        flex: 1,
    },
    chatName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 4,
    },
    chatDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chatMembers: {
        fontSize: 12,
        color: '#777777',
        marginRight: 12,
    },
    activeIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4CAF50',
        marginRight: 4,
    },
    activeText: {
        fontSize: 12,
        color: '#4CAF50',
    },
    recentGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 100, // Extra space for bottom navigation
    },
    recentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
        flex: 1,
    },
    recentImage: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
    },
    recentInfo: {
        padding: 10,
    },
    recentTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
    },
    recentChef: {
        fontSize: 11,
        color: '#777777',
        marginTop: 2,
    },
    recentStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
    },
    recentTime: {
        fontSize: 11,
        color: '#777777',
    },
    recentLikes: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recentLikesText: {
        fontSize: 11,
        color: '#777777',
        marginLeft: 3,
    },
    recentSaveButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 6,
        padding: 4,
    },
});
