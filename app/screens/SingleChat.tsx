import React, { FC } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageBackground
} from 'react-native';
import { ArrowLeft, Circle } from 'lucide-react';
import { router, useRouter } from 'expo-router';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp?: Date;
}

interface MessageBubbleProps {
  text: string;
  isUser: boolean;
}

interface Styles {
  container: ViewStyle;
  backgroundImage: ViewStyle;
  keyboardAvoidingView: ViewStyle;
  header: ViewStyle;
  headerTextContainer: ViewStyle;
  userName: TextStyle;
  userStatus: TextStyle;
  avatarContainer: ViewStyle;
  messagesContainer: ViewStyle;
  messageBubble: (isUser: boolean) => ViewStyle;
  messageText: TextStyle;
  inputContainer: ViewStyle;
  textInput: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0'
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    opacity: 1,
  },
  keyboardAvoidingView: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFEBC6',
    borderRadius: 16
  },
  headerTextContainer: {
    marginLeft: 16
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  userStatus: {
    color: '#666666'
  },
  avatarContainer: {
    marginLeft: 'auto'
  },
  messagesContainer: {
    flex: 1,
    paddingVertical: 16
  },
  messageBubble: (isUser: boolean) => ({
    backgroundColor: isUser ? '#E8E8E8' : '#F2D7D7',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: '80%',
    alignSelf: isUser ? 'flex-start' : 'flex-end',
    marginHorizontal: 16
  }),
  messageText: {
    fontSize: 16,
    color: '#000000'
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFEBC6'
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    maxHeight: 100
  }
});

const MessageBubble: FC<MessageBubbleProps> = ({ text, isUser }) => (
  <View style={styles.messageBubble(isUser)}>
    <Text style={styles.messageText}>{text}</Text>
  </View>
);

const ChatScreen: FC = () => {
  const messages: Message[] = [
    { id: 1, text: "on my way.!.!.!", isUser: true },
    { id: 2, text: "How many mins you think", isUser: false },
    { id: 3, text: "I wanna say 15 mins", isUser: true },
    { id: 4, text: "Okay sounds Good, see you then", isUser: false },
    { id: 5, text: "You Think you can stop my the Gas Station", isUser: false },
    { id: 6, text: "I need a drink, and some gum", isUser: false },
    { id: 7, text: "Sure ❤️?", isUser: true },
    { id: 8, text: "on my way...", isUser: true },
    { id: 9, text: "How many mins you think", isUser: false },
    { id: 10, text: "I wanna say 15 mins", isUser: true },
    { id: 11, text: "Okay sounds Good, see you then", isUser: false },
    { id: 12, text: "You Think you can stop my the Gas Station", isUser: false },
    { id: 13, text: "I need a drink, and some gum", isUser: false },
    { id: 14, text: "Sure ❤️", isUser: true },
    { id: 15, text: "on my way...", isUser: true },
    { id: 16, text: "How many mins you think", isUser: false },
    { id: 17, text: "I wanna say 15 mins", isUser: true },
    { id: 18, text: "Okay sounds Good, see you then", isUser: false },
    { id: 19, text: "You Think you can stop my the Gas Station", isUser: false },
    { id: 20, text: "I need a drink, and some gum", isUser: false },
    { id: 21, text: "Sure ❤️", isUser: true }
  ];

  const handleSendMessage = (text: string): void => {
    // Handle sending message
    console.log('Sending message:', text);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/chat')}
          >
            <ArrowLeft size={24} color="#000000" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.userName}>Diana Lopez</Text>
            <Text style={styles.userStatus}>Online</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Circle size={40} color="#CCCCCC" />
          </View>
        </View>

        {/* Messages ScrollView */}
        
        <ImageBackground
          source={require('@/assets/images/t.png')}
          style={styles.backgroundImage}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView 
              style={styles.messagesContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  text={message.text}
                  isUser={message.isUser}
                />
              ))}
            </ScrollView>
          </TouchableWithoutFeedback>
        </ImageBackground>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            multiline
            textAlignVertical="top"
            onSubmitEditing={(event) => handleSendMessage(event.nativeEvent.text)}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;