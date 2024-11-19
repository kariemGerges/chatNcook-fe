import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MessageItem } from '@/components/chatAndmessages/MessageItem';
import { styles } from '../../utils/styles';
import { Ionicons } from '@expo/vector-icons';

const sampleMessages = [
  {
    id: '1',
    content: 'Hello, how are you?',
    timestamp: new Date(),
    senderId: 'user1',
    type: 'text',
    status: 'sent',
    replyTo: null,
  },
  {
    id: '2',
    content: 'I am good, thank you!',
    timestamp: new Date(),
    senderId: 'currentUser',
    type: 'text',
    status: 'read',
    replyTo: null,
  },
];

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(sampleMessages);
  const flatListRef = useRef(null);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        content: message,
        timestamp: new Date(),
        senderId: 'currentUser',
        type: 'text',
        status: 'sending',
        replyTo: null,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => <MessageItem message={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={{
            flex: 1,
            backgroundColor: '#E9ECEF',
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginRight: 8,
          }}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!message.trim()}
          style={{ opacity: message.trim() ? 1 : 0.5 }}
        >
          <Ionicons name="send" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
