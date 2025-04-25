import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, ChatState, Chats } from '@/assets/types/types';

const initialState: ChatState = {
    chats: [],
    messages: {},
    loading: false,
    error: null,
};

const toMillis = (v: any) =>
    typeof v?.toMillis === 'function' ? v.toMillis() : v;

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChats: {
            reducer(state, action: PayloadAction<Chats[]>) {
                state.chats = action.payload;
            },
            prepare(raw: Chats[]) {
                return {
                    payload: raw.map((c) => ({
                        ...c,
                        lastUpdated: toMillis(c.lastUpdated),
                        createdAt: toMillis(c.createdAt),
                    })),
                };
            },
        },
        setMessages: {
            reducer(
                state,
                action: PayloadAction<{ chatId: string; messages: Message[] }>
            ) {
                state.messages[action.payload.chatId] = action.payload.messages;
            },
            prepare({
                chatId,
                messages,
            }: {
                chatId: string;
                messages: Message[];
            }) {
                return {
                    payload: {
                        chatId,
                        messages: messages.map((m) => ({
                            ...m,
                            createdAt: toMillis(m.createdAt),
                        })),
                    },
                };
            },
        },
        setMessagesById(
            state,
            action: PayloadAction<{ chatId: string; messages: Message[] }>
        ) {
            state.messages[action.payload.chatId] = action.payload.messages.map(
                (m) => ({
                    ...m,
                    createdAt:
                        typeof (m.createdAt as any)?.toMillis === 'function'
                            ? (m.createdAt as any).toMillis()
                            : m.createdAt,
                })
            );
            state.chats = state.chats.map((chat) =>
                chat.id === action.payload.chatId
                    ? {
                          ...chat,
                          messages: state.messages[action.payload.chatId],
                      }
                    : chat
            );
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
        addMessage: {
            reducer(
                state,
                action: PayloadAction<{ chatId: string; message: Message }>
            ) {
                if (!state.messages[action.payload.chatId])
                    state.messages[action.payload.chatId] = [];
                state.messages[action.payload.chatId].push(
                    action.payload.message
                );
            },
            prepare({ chatId, message }: { chatId: string; message: Message }) {
                return {
                    payload: {
                        chatId,
                        message: {
                            ...message,
                            createdAt: toMillis(message.createdAt),
                        },
                    },
                };
            },
        },
    },
});

export const {
    setChats,
    setLoading,
    setError,
    clearChatData,
    setMessages,
    addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
