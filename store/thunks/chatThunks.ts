//chatThunks.ts
import { AppDispatch } from '@/store/index';
import {
  setChats,
  setMessages,
  setLoading,
  setError,
  clearChatData,
} from '@/store/slices/chatSlice';
import { firestore } from '@/firebaseConfig';
import {
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { Chats, Message } from '@/assets/types/types';

export const listenToUserChats = (userId: string | null) => (
  dispatch: AppDispatch
) => {
  if (!userId) {
    dispatch(clearChatData());
    return () => {};
  }

  dispatch(setLoading(true));

  try {
    const chatsQuery = query(
      collection(firestore, 'chats'),
      where('participants', 'array-contains', userId)
    );

    const unsubscribeChats = onSnapshot(
      chatsQuery,
      (chatSnapshot) => {
        const chats = chatSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Chats, 'id'>),
        })) as Chats[];

        dispatch(setChats(chats));
        dispatch(setLoading(false));
        dispatch(setError(null));

        // Fetch messages for these chats
        const chatIds = chats.map((chat) => chat.id);

        const unsubscribeMessagesArray: (() => void)[] = [];

        chatIds.forEach((chatId) => {
          const messagesQuery = query(
            collection(firestore, `chats/${chatId}/messages`),
            orderBy('createdAt', 'asc')
          );

          const unsubscribeMessages = onSnapshot(
            messagesQuery,
            (messageSnapshot) => {
              const messages = messageSnapshot.docs.map((doc) => {
                const data = doc.data() as Message;
                const { id, ...rest } = data;
                return {
                  id: doc.id,
                  ...rest,
                };
              });

              dispatch(
                setMessages({
                  chatId,
                  messages,
                })
              );
              dispatch(setLoading(false));
              dispatch(setError(null));
            },
            (error) => {
              console.error(`Error fetching messages for chat ${chatId}:`, error);
              dispatch(setError(error.message));
              dispatch(setLoading(false));
            }
          );

          unsubscribeMessagesArray.push(unsubscribeMessages);
        });

        // Cleanup messages listeners when chats change
        return () => {
          unsubscribeMessagesArray.forEach((unsubscribe) => unsubscribe());
        };
      },
      (error) => {
        console.error('Error fetching chats:', error);
        dispatch(setError(error.message));
        dispatch(setLoading(false));
      }
    );

    // Cleanup chats listener
    return () => {
      unsubscribeChats();
    };
  } catch (err) {
    console.error('Error initializing listeners:', err);
    dispatch(setError((err as Error).message));
    dispatch(setLoading(false));
  }
};
