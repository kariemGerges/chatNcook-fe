// useUserChatMessagesFetcher.ts
import { useEffect, useState } from "react";
import { firestore } from "@/firebaseConfig";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { Message } from "@/assets/types/types";

const useUserChatMessagesFetcher = (chatId: string[] | null) => {
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [loadingMessages, setLoadingMessages] = useState<boolean>(true);
    const [errorMessages, setErrorMessages] = useState<string | null>(null);

    useEffect(() => {
        if (!chatId) {
            setChatMessages([]);
            setLoadingMessages(false);
            setErrorMessages(null);
        return;
    }

    setLoadingMessages(true);

    const chatMessagesRef = collection(firestore, 'chats', Array.isArray(chatId) ? chatId[0] : chatId, 'messages');    const q = query(chatMessagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
            const messages: Message[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Message),
            }));
            setChatMessages(messages);
            setLoadingMessages(false);
            setErrorMessages(null);
        },
        (err) => {
        console.error('Error fetching chat messages:', err);
        setErrorMessages((err as Error).message);
        setLoadingMessages(false);
    }
    );

    // Cleanup the listener on unmount or when chatId changes
    return () => unsubscribe();
  }, [chatId]);

  return { chatMessages, loadingMessages, errorMessages };
};

export default useUserChatMessagesFetcher;
