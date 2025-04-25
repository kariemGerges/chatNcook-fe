// the custom hook is 100% functional and can be used in any component that needs to access the user CHAT data. BUT IT BEEN REPLACED BY REDUX STORE

// =========================================================================================================== //

// // useUserChatMessagesFetcher.ts
// import { useEffect, useState } from 'react';
// import { firestore } from '@/firebaseConfig';
// import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
// import { Message } from '@/assets/types/types';

// const useUserChatMessagesFetcher = (chatId: string[] | null) => {
//     const [chatMessages, setChatMessages] = useState<Message[]>([]);
//     const [loadingMessages, setLoadingMessages] = useState<boolean>(true);
//     const [errorMessages, setErrorMessages] = useState<string | null>(null);

//     useEffect(() => {
//         if (!chatId) {
//             setChatMessages([]);
//             setLoadingMessages(false);
//             setErrorMessages(null);
//             return;
//         }

//         setLoadingMessages(true);

//         const chatMessagesRef = collection(
//             firestore,
//             'chats',
//             Array.isArray(chatId) ? chatId[0] : chatId,
//             'messages'
//         );
//         const q = query(chatMessagesRef, orderBy('createdAt', 'asc'));

//         const unsubscribe = onSnapshot(
//             q,
//             (querySnapshot) => {
//                 const messages: Message[] = querySnapshot.docs.map((doc) => {
//                     const data = doc.data() as Message;
//                     const { id, ...rest } = data;
//                     return { id: doc.id, ...rest };
//                 });
//                 setChatMessages(messages);
//                 setLoadingMessages(false);
//                 setErrorMessages(null);
//             },
//             (err) => {
//                 console.error('Error fetching chat messages:', err);
//                 setErrorMessages((err as Error).message);
//                 setLoadingMessages(false);
//             }
//         );

//         // Cleanup the listener on unmount or when chatId changes
//         return () => unsubscribe();
//     }, [chatId]);

//     return { chatMessages, loadingMessages, errorMessages };
// };

// export default useUserChatMessagesFetcher;
