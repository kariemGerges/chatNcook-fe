// the custom hook is 100% functional and can be used in any component that needs to access the user CHAT data. BUT IT BEEN REPLACED BY REDUX STORE

// =========================================================================================================== //

// import { useEffect, useState } from "react";
// import { firestore } from "@/firebaseConfig";
// import {
//     onSnapshot,
//     collection,
//     query,
//     where,
//     orderBy,
// } from "firebase/firestore";
// import { Chats, ChatDate, Message, DataChatsAndMessages } from "@/assets/types/types";

// const useChatDataFetcher = (userId: string | null) : DataChatsAndMessages => {
//     const [data, setData] = useState<ChatDate>({ chats: [], messages: [] });
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         if (!userId) {
//             setData({ chats: [], messages: [] });
//             setLoading(false);
//             setError(null);
//             return;
//         }

//         setLoading(true);

//         try {
//             // Fetch chats where the user is a participant
//             const chatsQuery = query(
//                 collection(firestore, "chats"),
//                 where("participants", "array-contains", userId)
//             );

//             const unsubscribeChats = onSnapshot(
//                 chatsQuery,
//                 (chatSnapshot) => {
//                     const chats = chatSnapshot.docs.map((doc) => ({
//                         id: doc.id,
//                         ...doc.data(),
//                     })) as Chats[];

//                     setData((prevData) => ({ ...prevData, chats }));

//                     // Fetch messages for these chats
//                     const chatIds = chats.map((chat) => chat.id);

//                     const unsubscribeMessagesArray: (() => void)[] = [];

//                     chatIds.forEach((chatId) => {
//                         const messagesQuery = query(
//                             collection(firestore, `chats/${chatId}/messages`),
//                             orderBy("createdAt", "asc")
//                         );

//                         const unsubscribeMessages = onSnapshot(
//                             messagesQuery,
//                             (messageSnapshot) => {
//                                 const messages = messageSnapshot.docs.map((doc) => ({
//                                     ...(doc.data() as Message),
//                                 }));

//                                 setData((prevData) => ({
//                                     ...prevData,
//                                     messages: [...prevData.messages, ...messages],
//                                 }));
//                                 setLoading(false);
//                                 setError(null);
//                             },
//                             (error) => {
//                                 console.error(`Error fetching messages for chat ${chatId}:`, error);
//                                 setError(error.message);
//                                 setLoading(false);
//                             }
//                         );

//                         unsubscribeMessagesArray.push(unsubscribeMessages);
//                     });

//                     // Cleanup messages listeners
//                     return () => {
//                         unsubscribeMessagesArray.forEach((unsubscribe) => unsubscribe());
//                     };
//                 },
//                 (error) => {
//                     console.error("Error fetching chats:", error);
//                     setError(error.message);
//                     setLoading(false);
//                 }
//             );

//             // Cleanup chats listener
//             return () => {
//                 unsubscribeChats();
//             };
//         } catch (err) {
//             console.error("Error initializing listeners:", err);
//             setError((err as Error).message);
//             setLoading(false);
//         }
//     }, [userId]);

//     return { data, loading, error, refetch: () => {} };
// };

// export default useChatDataFetcher;
