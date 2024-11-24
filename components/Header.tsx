import { memo, useCallback } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import SkeletonLoadingItem from "@/components/SkeletonLoadingItem";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export const Header = memo(() => {
    const { profileData, loading } = useSelector((state: RootState) => state.user);

    const getInitials = useCallback((name: string) => {
        return name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }, []);

    if (loading) {
        return <SkeletonLoadingItem />;
    }

    return (
        <LinearGradient
            colors={['#FF9966', '#FF5E62']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerGradient}
        >
            <View style={styles.header}>
                <View style={styles.leftSection}>
                    <Text style={styles.greeting}>Welcome back,</Text>
                    <Text style={styles.name}>{profileData?.name}</Text>
                </View>
                
                <View style={styles.rightSection}>
                    <TouchableOpacity style={styles.notificationButton}>
                        <View style={styles.notificationBadge}>
                            <Text style={styles.badgeText}>2</Text>
                        </View>
                        <Ionicons name="notifications" size={24} color="#FFF" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.profileImageContainer}>
                        {profileData?.avatar ? (
                            <Image
                                source={{ uri: profileData.avatar }}
                                style={styles.profileImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.initialsContainer}>
                                <Text style={styles.initialsText}>
                                    {getInitials(profileData?.name || '')}
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
        paddingTop: 50,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
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
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 4,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFF',
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
        color: '#FFF',
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

