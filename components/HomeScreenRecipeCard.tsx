import {
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Dimensions,
    FlatList,
} from 'react-native';
import { router } from 'expo-router';

import { Recipe } from '@/assets/types/types';
import { Ionicons } from '@expo/vector-icons';
import { useCarouselRecipe } from '@/hooks/useCarouselRecipe';
import { MaterialIcons } from '@expo/vector-icons';
import SkeletonLoadingItem from './SkeletonLoadingItem';
import { TrendingUp } from 'lucide-react';

const { width } = Dimensions.get('window');

interface Props {
    toggleSaved: (id: string) => void;
}

export default function HomeScreenRecipeCard({toggleSaved}: Props) {
    // Fetching trending recipes
    const { recipe, loading: recipeLoading, error } = useCarouselRecipe();

    const renderTrendingRecipe = ({ item }: { item: Recipe }) => (
        <TouchableOpacity
            onPress={() =>
                router.push({
                    pathname: '/screens/singleRecipe',
                    params: { recipeDetail: JSON.stringify(item) },
                })
            }
            style={styles.trendingCard}
        >
            <Image
                defaultSource={require('@/assets/images/sginup.webp')}
                source={{ uri: item.image_url }}
                style={styles.trendingImage}
            />

            <TouchableOpacity
                style={styles.saveButton}
                onPress={() => toggleSaved(item.id.toString())}
            >
                <Ionicons
                    name={item.saved ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    color={item.saved ? '#FE724C' : '#FFFFFF'}
                />
            </TouchableOpacity>

            <View style={styles.trendingInfo}>
                <Text style={styles.trendingTitle}>{item.title}</Text>

                <View style={styles.recipeDetails}>
                    <View style={styles.chefContainer}>
                        <Image
                            defaultSource={require('@/assets/images/chef1.webp')}
                            source={{ uri: item.chefAvatar }}
                            style={styles.chefAvatar}
                        />
                        <Text style={styles.chefName}>{item.author}</Text>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Ionicons
                                name="time-outline"
                                size={16}
                                color="#555555"
                            />
                            <Text style={styles.statText}>
                                {item.preparation_time}
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="heart" size={16} color="#FF4B4B" />
                            <Text style={styles.statText}>{item.likes? item.likes : 1158}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            {recipeLoading && <SkeletonLoadingItem />}
            {error && (
                <View style={styles.errorContainer}>
                    <MaterialIcons
                        name="error-outline"
                        size={24}
                        color="#DC3545"
                    />
                    <Text style={styles.errorText}>Couldn't load recipes</Text>
                </View>
            )}
            {!recipeLoading && !error && (
                <>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            Trending Now 🔥 <TrendingUp />{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: '/(tabs)/discover',
                                })
                            }
                        >
                            <Text style={styles.seeAllText}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={recipe}
                        renderItem={renderTrendingRecipe}
                        keyExtractor={(item) => item._id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.trendingList}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
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
        backgroundColor: 'rgba(3, 2, 0, 0.3)',
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
    errorContainer: {
        padding: 40,
        alignItems: 'center',
    },
    errorText: {
        color: '#DC3545',
        marginTop: 8,
    },
});
