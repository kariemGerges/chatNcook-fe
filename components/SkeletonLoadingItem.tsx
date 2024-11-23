import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const styles = StyleSheet.create({
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    skeletonAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    chatInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    skeletonTitle: {
        width: 160,
        height: 16,
        borderRadius: 4,
        marginBottom: 8,
    },
    skeletonSubtitle: {
        width: 120,
        height: 14,
        borderRadius: 4,
    },  
});

const SkeletonLoadingItem = () => (
    <View style={styles.chatItem}>
      <LinearGradient
        colors={['#F5F5F5', '#FFFFFF', '#F5F5F5']}
        style={styles.skeletonAvatar}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      <View style={styles.chatInfo}>
        <LinearGradient
          colors={['#F0F0F0', '#FFFFFF', '#F0F0F0']}
          style={styles.skeletonTitle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <LinearGradient
          colors={['#F0F0F0', '#FFFFFF', '#F0F0F0']}
          style={styles.skeletonSubtitle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
    </View>
  );

export default SkeletonLoadingItem;