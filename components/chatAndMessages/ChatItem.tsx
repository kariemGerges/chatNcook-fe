// components/ChatItem.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { Link } from 'expo-router';
import { styles } from '@/utils/styles';
import { Ionicons } from '@expo/vector-icons';
import type { Chats } from '@/assets/types/types';

interface ChatItemProps {
  chat: Chats;
}

export function ChatItem({ chat }: ChatItemProps) {
  // Status color mapping
  const statusColors = {
    online: '#34D399',
    offline: '#6B7280',
    away: '#FBBF24',
  };

  return (
    <Link href={`/messages/${chat.id}`} asChild>
      <TouchableOpacity style={styles.chatItem}>
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: chat.avatar }}
            style={styles.avatar}
          />
          <View
            style={[
              styles.statusDot,
              { backgroundColor: statusColors[chat.status] }
            ]}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>
              {chat.name}
            </Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              {formatTime(chat.timestamp)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            {chat.typing ? (
              <Text style={{ color: '#007AFF', fontSize: 14 }}>
                Typing...
              </Text>
            ) : (
              <>
                <Text
                  style={{ flex: 1, color: '#666', fontSize: 14 }}
                  numberOfLines={1}
                >
                  {chat.lastMessage}
                </Text>
                {chat.unreadCount > 0 && (
                  <View style={{
                    backgroundColor: '#007AFF',
                    borderRadius: 12,
                    minWidth: 24,
                    height: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 8,
                  }}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>
                      {chat.unreadCount}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}