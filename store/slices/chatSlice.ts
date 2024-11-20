import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, ChatState, Chats } from '../../assets/types/types';


const initialState: ChatState = {
    chats: [],
    messages: {},
    loading: false,
    error: null
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChats(state, action: PayloadAction<Chats[]>) {
            state.chats = action.payload;
        },
        setMessages(
            state,
            action: PayloadAction<{ chatId: string; messages: Message[] }>
        ) {
            state.messages[action.payload.chatId] = action.payload.messages;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        clearChatData(state) {
            state.chats = [];
            state.messages = {};
            state.loading = false;
            state.error = null;
        },
        addMessage(
            state,
            action: PayloadAction<{ chatId: string; message: Message }>
        ) {
            if (!state.messages[action.payload.chatId]) {
            state.messages[action.payload.chatId] = [];
            }
            state.messages[action.payload.chatId].push(action.payload.message);
        },
    // Add more reducers here
  },
});

export const { 
    setChats, setLoading, setError, clearChatData, setMessages, addMessage } = chatSlice.actions;

export default chatSlice.reducer;
