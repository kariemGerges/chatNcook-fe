import { memo, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import SkeletonLoadingItem from '@/components/SkeletonLoadingItem';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export const Header = memo(() => {
    const { profileData: userProfileData, loading: userProfileLoading } =
        useSelector((state: RootState) => state.user);

    const getInitials = useCallback((name: string) => {
        return name
            ?.split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }, []);

    const getTimeBasedGreeting = useCallback(() => {
        // Get the current hour
        const currentHour = new Date().getHours();

        // Determine the greeting based on the current hour
        if (currentHour >= 5 && currentHour < 12) {
            return 'Good morning';
        } else if (currentHour >= 12 && currentHour < 18) {
            return 'Good afternoon';
        } else {
            return 'Good evening';
        }
    }, []);

    if (userProfileLoading) {
        return <SkeletonLoadingItem />;
    }

    return (
        <LinearGradient
            colors={['#FF9966', '#FFCC66']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerGradient}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        router.push('/screens/profileScreen/profile');
                    }}
                    style={{ padding: 8 }}
                >
                    <View style={styles.leftSection}>
                        <Text style={styles.greeting}>
                            {getTimeBasedGreeting()}
                        </Text>
                        <Text style={styles.name}>
                            {userProfileLoading
                                ? 'Loading...'
                                : userProfileData?.name || 'Guest'}
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.rightSection}>
                    {/* Notification button */}
                    <TouchableOpacity
                        onPress={() => {
                            router.push('/screens/FriendRequestsScreen');
                        }}
                        style={styles.notificationButton}
                    >
                        <View style={styles.notificationBadge}>
                            <Text style={styles.badgeText}>2</Text>
                        </View>
                        <Ionicons name="notifications" size={24} color="#FFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            router.push('/screens/profileScreen/profile');
                        }}
                        style={styles.profileImageContainer}
                    >
                        {userProfileData?.avatar ? (
                            <Image
                                source={{ uri: userProfileData.avatar }}
                                style={styles.profileImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.initialsContainer}>
                                <Text style={styles.initialsText}>
                                    {getInitials(userProfileData?.name || '')}
                                </Text>
                            </View>
                        )}
                        <View style={styles.onlineIndicator} />
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
});

const styles = StyleSheet.create({
    headerGradient: {
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        paddingHorizontal: 20,
    },
    leftSection: {
        flex: 1,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    greeting: {
        fontSize: 16,
        fontFamily: 'helvetica',
        marginBottom: 4,
    },
    name: {
        paddingTop: 4,
        fontSize: 20,
        fontWeight: '700',
        fontFamily: 'helvetica',
    },
    notificationButton: {
        position: 'relative',
        padding: 8,
    },
    notificationBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#FF3B30',
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    profileImageContainer: {
        position: 'relative',
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E0E0E0',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
    },
    initialsContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialsText: {
        color: '#00000',
        fontSize: 16,
        fontWeight: '600',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#4CD964',
        borderWidth: 2,
        borderColor: '#FFF',
    },
});
