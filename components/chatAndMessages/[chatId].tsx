import React, { useState, useRef } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Message Interface
interface Message {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
  type: 'text' | 'image' | 'file';
  status: 'sending' | 'sent' | 'read' | 'failed';
  replyTo?: string | null;
}

// Sample Messages
const sampleMessages: Message[] = [
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

// MessageItem Component (you can create a separate file for this)
const MessageItem: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <View style={{ 
      backgroundColor: message.senderId === 'currentUser' ? '#007AFF' : '#E9ECEF',
      padding: 10,
      borderRadius: 10,
      marginVertical: 5
    }}>
      <Text>{message.content}</Text>
    </View>
  );
};

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const flatListRef = useRef<FlatList>(null);

  // Send messages
  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
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
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => <MessageItem message={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />

      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 16, 
        borderTopWidth: 1, 
        borderTopColor: '#E9ECEF' 
      }}>
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