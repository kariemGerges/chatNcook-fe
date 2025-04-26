// // HomeScreen.tsx
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     Dimensions,
// } from 'react-native';
// import { router } from 'expo-router';
// import { useEffect } from 'react';
// import { MaterialIcons } from '@expo/vector-icons';
// import { Header } from '@/components/Header';
// import HomeScreenRecipeCard from '@/components/HomeScreenRecipeCard';
// import HomeScreenRecentChats from '@/components/HomeScreenRecentChats';

// import { RootState } from '@/store';
// import { useSelector } from 'react-redux';

// const { width } = Dimensions.get('window');

// export default function HomeScreen() {

//     // Getting user data from Redux read slice
//     const {
//         user,
//         loading: userLoading,
//         userError,
//     } = useSelector((state: RootState) => state.user);

//     // Redirect to welcome screen if user is not logged in
//     useEffect(() => {
//         if (!user && !userLoading) {
//             // router.push('/screens/welcomeScreen');
//             router.push('/screens/testscreen')
//         } else if (userError) {
//             router.push('/+not-found');
//         }
//     }, [user, userLoading]);

//     return (
//         <View style={styles.container}>
//             <Header />
//             <HomeScreenRecipeCard />

//             <View style={styles.chatHeader}>
//                 <Text style={styles.recentChatsTitle}>Recent Chats</Text>
//                 <TouchableOpacity
//                     onPress={() => router.push('/chat')}
//                     style={styles.seeAllButton}
//                 >
//                     <Text style={styles.seeAllText}>See all</Text>
//                     <MaterialIcons
//                         name="arrow-forward"
//                         size={16}
//                         color="#007AFF"
//                     />
//                 </TouchableOpacity>
//             </View>

//             <HomeScreenRecentChats />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#FFEBC6',
//     },
//     chatHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         marginTop: 8,
//         marginBottom: 16,
//         backgroundColor: '#FFEBC6',
//     },
//     recentChatsTitle: {
//         paddingVertical: 16,
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#5C4033',
//     },
//     seeAllButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     seeAllText: {
//         color: '#007AFF',
//         fontSize: 14,
//         marginRight: 4,
//     },
// });