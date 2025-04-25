// components/MessageItem.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { styles } from '@/utils/styles';
import { Ionicons } from '@expo/vector-icons';
import type { Message } from '@/assets/types/types';

interface MessageItemProps {
  message: Message;
  onReply: () => void;
}

export default function MessageItem({ message, onReply }: MessageItemProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const isSentByMe = message.senderId === 'currentUser';

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderMessageStatus = () => {
    switch (message.status) {
      case 'sending':
        return <Ionicons name="time" size={16} color="#666" />;
      case 'sent':
        return <Ionicons name="checkmark" size={16} color="#666" />;
      case 'delivered':
        return <Ionicons name="checkmark-done" size={16} color="#666" />;
      case 'read':
        return <Ionicons name="checkmark-done" size={16} color="#007AFF" />;
    }
  };

  return (
    <TouchableOpacity onLongPress={onReply}>
      <Animated.View
        style={[
          styles.messageContainer,
          isSentByMe ? styles.sentMessage : styles.receivedMessage,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        {message.replyTo && (
          <View style={{
            padding: 8,
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: 8,
            marginBottom: 8,
          }}>
            <Text style={{ fontSize: 12, opacity: 0.7 }}>
              {message.replyTo.content}
            </Text>
          </View>
        )}
        <Text style={{ color: isSentByMe ? '#fff' : '#000' }}>
          {message.content}
        </Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginTop: 4,
        }}>
          <Text style={{
            fontSize: 12,
            color: isSentByMe ? 'rgba(255,255,255,0.7)' : '#666',
            marginRight: 4,
          }}>
            {/* {formatTime(message.timestamp)} */}
          </Text>
          {isSentByMe && renderMessageStatus()}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}