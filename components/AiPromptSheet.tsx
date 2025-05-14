// // // import React, { forwardRef, useState, useMemo, useEffect } from 'react';
// // // import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
// // // import BottomSheet from '@gorhom/bottom-sheet';
// // // import { getCookingAdviceGemini } from '@/utils/gemini';

// // // export const AiPromptSheet = forwardRef<BottomSheet>((_, ref) => {
// // //     const [prompt, setPrompt] = useState('');
// // //     const [response, setResponse] = useState('');

// // //     // ✅ FIX: wrap snapPoints in useMemo
// // //     const snapPoints = useMemo(() => ['50%'], []);

// // //     const sendPrompt = async () => {
// // //         const result = await getCookingAdviceGemini(prompt);
// // //         setResponse(result || 'No response from ChatNCook.');
// // //     };

// // //     useEffect(() => {
// // //         console.log('[Sheet] mounted, ref =', ref);
// // //     }, []);

// // //     return (
// // //         <BottomSheet
// // //             ref={ref}
// // //             index={0}
// // //             snapPoints={snapPoints}
// // //             enablePanDownToClose
// // //             backgroundStyle={{ borderRadius: 24 }}
// // //         >
// // //             <View style={styles.content}>
// // //                 <Text style={styles.label}>Ask the ChatNCook 🤖</Text>
// // //                 <TextInput
// // //                     value={prompt}
// // //                     onChangeText={setPrompt}
// // //                     placeholder="e.g. Replace butter with..."
// // //                     style={styles.input}
// // //                 />
// // //                 <Button title="Send" onPress={sendPrompt} />
// // //                 {response && <Text style={styles.response}>{response}</Text>}
// // //             </View>
// // //         </BottomSheet>
// // //     );
// // // });

// // // const styles = StyleSheet.create({
// // //     content: { flex: 1, padding: 20 },
// // //     label: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
// // //     input: {
// // //         borderColor: '#ccc',
// // //         borderWidth: 1,
// // //         borderRadius: 12,
// // //         padding: 12,
// // //         marginBottom: 12,
// // //     },
// // //     response: {
// // //         marginTop: 20,
// // //         backgroundColor: '#FFF3E0',
// // //         padding: 12,
// // //         borderRadius: 10,
// // //         fontSize: 14,
// // //     },
// // // });
// // import React, { useState } from 'react';
// // import {
// //     View,
// //     TextInput,
// //     Button,
// //     StyleSheet,
// //     Text,
// //     Modal,
// //     TouchableOpacity,
// //     SafeAreaView,
// // } from 'react-native';
// // import { MaterialCommunityIcons } from '@expo/vector-icons';
// // import { getCookingAdviceGemini } from '@/utils/gemini';
// // import useAiRespondFetcher from '@/hooks/useAiRespondFetcher';

// // interface AiPromptSheetProps {
// //     isVisible: boolean;
// //     onClose: () => void;
// // }

// // export const AiPromptSheet = ({ isVisible, onClose }: AiPromptSheetProps) => {
// //     const [prompt, setPrompt] = useState('');
// //     // const [response, setResponse] = useState('');
// //     // const [isLoading, setIsLoading] = useState(false);

// //     const { history, sendMessage, loading, error, latestResponse } =
// //         useAiRespondFetcher();

// //     const sendPrompt = async () => {
// //         if (!prompt.trim()) return;

// //         try {
// //             await sendMessage(prompt);
// //         } catch (error) {
// //             console.error('Failed to get AI response:', error);
// //         };
// //     };

// //     if (!isVisible) return null;

// //     return (
// //         <Modal
// //             visible={isVisible}
// //             animationType="slide"
// //             transparent={true}
// //             onRequestClose={onClose}
// //         >
// //             <SafeAreaView style={styles.modalContainer}>
// //                 <View style={styles.modalContent}>
// //                     <View style={styles.header}>
// //                         <Text style={styles.label}>Ask the ChatNCook 💬</Text>
// //                         <TouchableOpacity
// //                             onPress={onClose}
// //                             style={styles.closeButton}
// //                         >
// //                             <MaterialCommunityIcons
// //                                 name="close"
// //                                 size={24}
// //                                 color="#333"
// //                             />
// //                         </TouchableOpacity>
// //                     </View>

// //                     <TextInput
// //                         value={prompt}
// //                         onChangeText={setPrompt}
// //                         placeholder="e.g. Replace butter with..."
// //                         style={styles.input}
// //                         multiline
// //                     />

// //                     <Button
// //                         title={aiLoading ? 'Sending...' : 'Send'}
// //                         onPress={sendPrompt}
// //                         disabled={aiLoading || !prompt.trim()}
// //                     />

// //                     {aiResponse ? (
// //                         <View style={styles.responseContainer}>
// //                             <Text style={styles.responseLabel}>
// //                                 ChatNCook says:
// //                             </Text>
// //                             <Text style={styles.response}>{aiResponse}</Text>
// //                         </View>
// //                     ) : null}
// //                 </View>
// //             </SafeAreaView>
// //         </Modal>
// //     );
// // };

// // const styles = StyleSheet.create({
// //     // Modal styles
// //     modalContainer: {
// //         flex: 1,
// //         backgroundColor: 'rgba(238, 136, 41, 0.05)',
// //         justifyContent: 'flex-end',
// //     },
// //     modalContent: {
// //         backgroundColor: 'white',
// //         borderTopLeftRadius: 20,
// //         borderTopRightRadius: 20,
// //         padding: 20,
// //         maxHeight: '70%',
// //     },
// //     header: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         marginBottom: 15,
// //     },
// //     label: {
// //         fontWeight: 'bold',
// //         fontSize: 18,
// //     },
// //     closeButton: {
// //         padding: 5,
// //     },
// //     input: {
// //         borderColor: '#ccc',
// //         borderWidth: 1,
// //         borderRadius: 12,
// //         padding: 12,
// //         marginBottom: 15,
// //         minHeight: 60,
// //     },
// //     responseContainer: {
// //         marginTop: 20,
// //     },
// //     responseLabel: {
// //         fontWeight: '600',
// //         marginBottom: 5,
// //     },
// //     response: {
// //         backgroundColor: '#FFF3E0',
// //         padding: 12,
// //         borderRadius: 10,
// //         fontSize: 14,
// //     },
// // // });
// // import React, { useState, useRef, useMemo, useEffect } from 'react';
// // import {
// //     View,
// //     TextInput,
// //     Text,
// //     StyleSheet,
// //     FlatList,
// //     Keyboard,
// //     TouchableOpacity,
// //     ActivityIndicator,
// // } from 'react-native';
// // import BottomSheet from '@gorhom/bottom-sheet';
// // import { MaterialCommunityIcons } from '@expo/vector-icons';
// // import * as Speech from 'expo-speech';
// // import useAiRespondFetcher from '@/hooks/useAiRespondFetcher';

// // interface AiPromptSheetProps {
// //     sheetRef: React.RefObject<BottomSheet>;
// // }

// // export const AiPromptSheet = ({ sheetRef }: AiPromptSheetProps) => {
// //     const [prompt, setPrompt] = useState('');
// //     const [isListening, setIsListening] = useState(false);
// //     const snapPoints = useMemo(() => ['50%', '85%'], []);

// //     const {
// //         history,
// //         sendMessage,
// //         loading: aiLoading,
// //         latestResponse,
// //         error,
// //     } = useAiRespondFetcher();

// //     // Send prompt to AI
// //     const handleSend = async () => {
// //         if (!prompt.trim()) return;
// //         await sendMessage(prompt.trim());
// //         setPrompt('');
// //         Keyboard.dismiss();
// //     };

// //     // Handle mic press (placeholder for speech-to-text logic)
// //     const handleMicPress = () => {
// //         // Toggle listening state
// //         setIsListening((prev) => !prev);

// //         // Placeholder: Replace with actual speech-to-text logic
// //         if (!isListening) {
// //             Speech.speak('Sorry, speech-to-text is not implemented yet.');
// //         }
// //     };

// //     // Combine messages for rendering (assumes AI and user alternate)
// //     const messages = history.map((msg, i) => ({
// //         id: i.toString(),
// //         sender: msg.role === 'user' ? 'You' : 'ChatNCook',
// //         text: msg.parts[0].text,
// //         isUser: msg.role === 'user',
// //     }));

// //     return (
// //         <BottomSheet
// //             ref={sheetRef}
// //             index={0}
// //             snapPoints={snapPoints}
// //             enablePanDownToClose
// //             backgroundStyle={{ borderRadius: 24, backgroundColor: '#fff' }}
// //         >
// //             <View style={styles.content}>
// //                 <Text style={styles.title}>Ask ChatNCook 🍳</Text>

// //                 <FlatList
// //                     data={messages}
// //                     keyExtractor={(item) => item.id}
// //                     style={styles.messageList}
// //                     contentContainerStyle={{ paddingBottom: 20 }}
// //                     renderItem={({ item }) => (
// //                         <View
// //                             style={[
// //                                 styles.messageBubble,
// //                                 item.isUser
// //                                     ? styles.userBubble
// //                                     : styles.aiBubble,
// //                             ]}
// //                         >
// //                             <Text style={styles.messageSender}>
// //                                 {item.sender}:
// //                             </Text>
// //                             <Text style={styles.messageText}>{item.text}</Text>
// //                         </View>
// //                     )}
// //                 />

// //                 {aiLoading && (
// //                     <View style={styles.typing}>
// //                         <ActivityIndicator size="small" color="#f57c00" />
// //                         <Text style={styles.typingText}>
// //                             ChatNCook is typing...
// //                         </Text>
// //                     </View>
// //                 )}

// //                 {error && <Text style={styles.errorText}>❗ {error}</Text>}

// //                 <View style={styles.inputRow}>
// //                     <TouchableOpacity
// //                         onPress={handleMicPress}
// //                         style={styles.micButton}
// //                     >
// //                         <MaterialCommunityIcons
// //                             name={isListening ? 'microphone-off' : 'microphone'}
// //                             size={24}
// //                             color={isListening ? '#f44336' : '#555'}
// //                         />
// //                     </TouchableOpacity>

// //                     <TextInput
// //                         value={prompt}
// //                         onChangeText={setPrompt}
// //                         placeholder="e.g. How do I cook lentils?"
// //                         style={styles.input}
// //                         multiline
// //                     />

// //                     <TouchableOpacity
// //                         onPress={handleSend}
// //                         disabled={aiLoading || !prompt.trim()}
// //                         style={[
// //                             styles.sendButton,
// //                             (aiLoading || !prompt.trim()) && {
// //                                 backgroundColor: '#ccc',
// //                             },
// //                         ]}
// //                     >
// //                         <MaterialCommunityIcons
// //                             name="send"
// //                             size={20}
// //                             color="#fff"
// //                         />
// //                     </TouchableOpacity>
// //                 </View>
// //             </View>
// //         </BottomSheet>
// //     );
// // };
// // const styles = StyleSheet.create({
// //     content: {
// //         flex: 1,
// //         padding: 16,
// //     },
// //     title: {
// //         fontSize: 18,
// //         fontWeight: 'bold',
// //         marginBottom: 10,
// //     },
// //     messageList: {
// //         flex: 1,
// //         marginBottom: 10,
// //     },
// //     messageBubble: {
// //         padding: 10,
// //         borderRadius: 10,
// //         marginVertical: 5,
// //         maxWidth: '90%',
// //     },
// //     userBubble: {
// //         backgroundColor: '#e3f2fd',
// //         alignSelf: 'flex-end',
// //     },
// //     aiBubble: {
// //         backgroundColor: '#fff3e0',
// //         alignSelf: 'flex-start',
// //     },
// //     messageSender: {
// //         fontWeight: '600',
// //         marginBottom: 2,
// //     },
// //     messageText: {
// //         fontSize: 15,
// //         color: '#333',
// //     },
// //     inputRow: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         marginTop: 8,
// //     },
// //     input: {
// //         flex: 1,
// //         borderWidth: 1,
// //         borderColor: '#ddd',
// //         borderRadius: 12,
// //         padding: 10,
// //         backgroundColor: '#fff',
// //         marginHorizontal: 8,
// //         maxHeight: 100,
// //     },
// //     micButton: {
// //         padding: 6,
// //     },
// //     sendButton: {
// //         backgroundColor: '#f57c00',
// //         padding: 10,
// //         borderRadius: 30,
// //     },
// //     typing: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         marginTop: 5,
// //     },
// //     typingText: {
// //         marginLeft: 8,
// //         fontStyle: 'italic',
// //         color: '#888',
// //     },
// //     errorText: {
// //         color: 'red',
// //         marginTop: 5,
// //     },
// // });
// import React, { useState } from 'react';
// import {
//     View,
//     TextInput,
//     Button,
//     StyleSheet,
//     Text,
//     Modal,
//     TouchableOpacity,
//     SafeAreaView,
//     ScrollView,
// } from 'react-native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import useAiRespondFetcher from '@/hooks/useAiRespondFetcher';

// interface AiPromptSheetProps {
//     isVisible: boolean;
//     onClose: () => void;
// }

// export const AiPromptSheet = ({ isVisible, onClose }: AiPromptSheetProps) => {
//     const [prompt, setPrompt] = useState('');
//     const {
//         history,
//         sendMessage,
//         loading: aiLoading,
//         error,
//         latestResponse: aiResponse,
//     } = useAiRespondFetcher();

//     const sendPrompt = async () => {
//         if (!prompt.trim()) return;
//         try {
//             await sendMessage(prompt);
//             setPrompt('');
//         } catch (error) {
//             console.error('Failed to get AI response:', error);
//         }
//     };

//     if (!isVisible) return null;

//     return (
//         <Modal
//             visible={isVisible}
//             animationType="slide"
//             transparent
//             onRequestClose={onClose}
//         >
//             <SafeAreaView style={styles.modalContainer}>
//                 <View style={styles.modalContent}>
//                     <View style={styles.header}>
//                         <Text style={styles.label}>Ask ChatNCook 💬</Text>
//                         <TouchableOpacity
//                             onPress={onClose}
//                             style={styles.closeButton}
//                         >
//                             <MaterialCommunityIcons
//                                 name="close"
//                                 size={24}
//                                 color="#333"
//                             />
//                         </TouchableOpacity>
//                     </View>

//                     <TextInput
//                         value={prompt}
//                         onChangeText={setPrompt}
//                         placeholder="e.g. How to thicken soup without flour?"
//                         style={styles.input}
//                         multiline
//                         editable={!aiLoading}
//                     />

//                     <Button
//                         title={aiLoading ? 'Sending...' : 'Send'}
//                         onPress={sendPrompt}
//                         disabled={aiLoading || !prompt.trim()}
//                     />

//                     {error && <Text style={styles.error}>❗ {error}</Text>}

//                     {aiResponse && (
//                         <ScrollView style={styles.responseScroll}>
//                             <View style={styles.responseContainer}>
//                                 <Text style={styles.responseLabel}>
//                                     ChatNCook says:
//                                 </Text>
//                                 <Text style={styles.response}>
//                                     {aiResponse}
//                                 </Text>
//                             </View>
//                         </ScrollView>
//                     )}
//                 </View>
//             </SafeAreaView>
//         </Modal>
//     );
// };
// const styles = StyleSheet.create({
//     modalContainer: {
//         flex: 1,
//         backgroundColor: 'rgba(238, 136, 41, 0.05)',
//         justifyContent: 'flex-end',
//     },
//     modalContent: {
//         backgroundColor: 'white',
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         padding: 20,
//         maxHeight: '75%',
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 15,
//     },
//     label: {
//         fontWeight: 'bold',
//         fontSize: 18,
//     },
//     closeButton: {
//         padding: 5,
//     },
//     input: {
//         borderColor: '#ccc',
//         borderWidth: 1,
//         borderRadius: 12,
//         padding: 12,
//         marginBottom: 15,
//         minHeight: 60,
//     },
//     responseScroll: {
//         marginTop: 16,
//         maxHeight: 180,
//     },
//     responseContainer: {
//         backgroundColor: '#FFF3E0',
//         padding: 12,
//         borderRadius: 10,
//     },
//     responseLabel: {
//         fontWeight: '600',
//         marginBottom: 6,
//     },
//     response: {
//         fontSize: 15,
//         lineHeight: 22,
//         color: '#444',
//     },
//     error: {
//         color: 'red',
//         marginTop: 10,
//     },
// });
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Modal,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useAiRespondFetcher from '@/hooks/useAiRespondFetcher';
import { rgbaColor } from 'react-native-reanimated/lib/typescript/Colors';

interface AiPromptSheetProps {
    isVisible: boolean;
    onClose: () => void;
}

export const AiPromptSheet = ({ isVisible, onClose }: AiPromptSheetProps) => {
    const [prompt, setPrompt] = useState('');
    const {
        history,
        sendMessage,
        loading: aiLoading,
        error,
    } = useAiRespondFetcher();

    const handleSend = async () => {
        if (!prompt.trim()) return;
        await sendMessage(prompt.trim());
        setPrompt('');
    };

    const renderMessage = ({ item }: { item: any }) => (
        <View
            style={[
                styles.messageBubble,
                item.role === 'user' ? styles.userBubble : styles.aiBubble,
            ]}
        >
            <Text style={styles.sender}>
                {item.role === 'user' ? '🧑 You' : '👩‍🍳 ChatNCook'}
            </Text>
            <Text style={styles.message}>{item.parts[0].text}</Text>
        </View>
    );

    if (!isVisible) return null;

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Chat with ChatNCook</Text>
                    <TouchableOpacity onPress={onClose}>
                        <MaterialCommunityIcons
                            name="close"
                            size={28}
                            color="#333"
                        />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={history}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messages}
                    showsHorizontalScrollIndicator={false}
                />

                {aiLoading && (
                    <View style={styles.typingContainer}>
                        <ActivityIndicator size="small" color="#f57c00" />
                        <Text style={styles.typingText}>
                            ChatNCook is typing...
                        </Text>
                    </View>
                )}

                {error && <Text style={styles.error}>❗ {error}</Text>}

                <View style={styles.inputRow}>
                    <TextInput
                        value={prompt}
                        onChangeText={setPrompt}
                        placeholder="Ask ChatNCook..."
                        style={styles.input}
                        multiline
                    />
                    <TouchableOpacity
                        onPress={handleSend}
                        disabled={aiLoading || !prompt.trim()}
                        style={[
                            styles.sendButton,
                            (aiLoading || !prompt.trim()) &&
                                styles.disabledButton,
                        ]}
                    >
                        <MaterialCommunityIcons
                            name="send"
                            size={22}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(221, 153, 85, 0.1)',
        padding: 20,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    messages: {
        paddingVertical: 10,
        paddingBottom: 30,
    },
    messageBubble: {
        marginVertical: 6,
        padding: 10,
        borderRadius: 10,
        maxWidth: '85%',
    },
    userBubble: {
        backgroundColor: '#e1f5fe',
        alignSelf: 'flex-end',
    },
    aiBubble: {
        backgroundColor: '#fff3e0',
        alignSelf: 'flex-start',
    },
    sender: {
        fontWeight: '600',
        marginBottom: 2,
    },
    message: {
        fontSize: 15,
        color: '#333',
    },
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    typingText: {
        marginLeft: 6,
        color: '#888',
        fontStyle: 'italic',
    },
    error: {
        color: 'red',
        marginTop: 5,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 'auto',
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: '#eee',
    },
    input: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 12,
        padding: 10,
        maxHeight: 100,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#f57c00',
        padding: 10,
        borderRadius: 25,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
});
