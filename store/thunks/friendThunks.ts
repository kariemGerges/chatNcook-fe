import { AppDispatch } from '@/store';
import {
    setSearchResults,
    setSearching,
    setSearchError,
    addSentFriendRequest,
    removeReceivedFriendRequest,
    removeSentFriendRequest,
    addFriend,
    setFriends,
} from '@/store/slices/friendSlice';
import { firestore } from '@/firebaseConfig';
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    onSnapshot,
} from 'firebase/firestore';
import { FriendProfile } from '@/assets/types/types';

// Search friends by email or phone
export const searchFriends =
    (searchType: 'email' | 'phone', searchValue: string) =>
    async (dispatch: AppDispatch) => {
        if (!searchValue.trim()) {
            dispatch(setSearchResults([]));
            return;
        }

        dispatch(setSearching(true));
        dispatch(setSearchError(null));

        try {
            // Determine which field to search based on searchType
            const fieldPath = searchType === 'email' ? 'email' : 'phoneNumber';

            // For phone search, normalize the input (remove spaces, dashes, etc.)
            let normalizedValue = searchValue;
            if (searchType === 'phone') {
                normalizedValue = searchValue.replace(/[^\d+]/g, '');
            }

            // Create the query
            const usersRef = collection(firestore, 'users');
            const q = query(usersRef, where(fieldPath, '==', normalizedValue));

            const querySnapshot = await getDocs(q);
            const results: FriendProfile[] = [];

            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                results.push({
                    id: doc.id,
                    displayName: userData.displayName || 'User',
                    email: userData.email || null,
                    phoneNumber: userData.phoneNumber || null,
                    photoURL: userData.photoURL || null,
                    lastSeen: userData.lastSeen || null,
                    status: userData.status || 'offline',
                });
            });

            dispatch(setSearchResults(results));
        } catch (error) {
            console.error('Error searching for friends:', error);
            dispatch(setSearchError((error as Error).message));
        } finally {
            dispatch(setSearching(false));
        }
    };

// Send friend request
export const sendFriendRequest =
    (currentUserId: string, targetUserId: string) =>
    async (dispatch: AppDispatch) => {
        try {
            const timestamp = Date.now();

            // Add to current user's sent requests
            const currentUserRef = doc(firestore, 'users', currentUserId);
            await updateDoc(currentUserRef, {
                'friendRequests.sent': arrayUnion({
                    userId: targetUserId,
                    timestamp,
                }),
            });

            // Add to target user's received requests
            const targetUserRef = doc(firestore, 'users', targetUserId);

            // Get current user's profile to include in the request
            const currentUserDoc = await getDoc(currentUserRef);
            const currentUserData = currentUserDoc.data();

            await updateDoc(targetUserRef, {
                'friendRequests.received': arrayUnion({
                    userId: currentUserId,
                    timestamp,
                    from: {
                        id: currentUserId,
                        displayName: currentUserData?.displayName || 'User',
                        email: currentUserData?.email || null,
                        phoneNumber: currentUserData?.phoneNumber || null,
                        photoURL: currentUserData?.photoURL || null,
                    },
                }),
            });

            // Update Redux state
            dispatch(
                addSentFriendRequest({
                    id: targetUserId,
                    timestamp,
                })
            );
        } catch (error) {
            console.error('Error sending friend request:', error);
            throw error;
        }
    };

// Accept friend request
export const acceptFriendRequest =
    (currentUserId: string, requesterId: string) =>
    async (dispatch: AppDispatch) => {
        try {
            // First, get the current user's document to find the exact request object
            const currentUserRef = doc(firestore, 'users', currentUserId);
            const currentUserDoc = await getDoc(currentUserRef);
            const currentUserData = currentUserDoc.data();

            if (!currentUserData) {
                throw new Error('Current user profile not found');
            }

            // Find the exact request object to remove
            const receivedRequests =
                currentUserData.friendRequests?.received || [];
            interface FriendRequest {
                userId: string;
                timestamp?: number;
                from?: {
                    id: string;
                    displayName: string;
                    email: string | null;
                    phoneNumber: string | null;
                    photoURL: string | null;
                };
            }

            const requestToRemove: FriendRequest | undefined =
                receivedRequests.find(
                    (req: FriendRequest) => req.userId === requesterId
                );

            if (!requestToRemove) {
                throw new Error('Friend request not found');
            }

            // Get requester profile from the request
            const requesterProfile = {
                id: requesterId,
                displayName: requestToRemove.from?.displayName || 'User',
                email: requestToRemove.from?.email || null,
                phoneNumber: requestToRemove.from?.phoneNumber || null,
                photoURL: requestToRemove.from?.photoURL || null,
            };

            // Now remove the exact object
            await updateDoc(currentUserRef, {
                friends: arrayUnion(requesterProfile),
                'friendRequests.received': arrayRemove(requestToRemove),
            });

            // Do the same for the requester side
            const requesterRef = doc(firestore, 'users', requesterId);
            const requesterDoc = await getDoc(requesterRef);
            const requesterData = requesterDoc.data();

            if (!requesterData) {
                throw new Error('Requester user profile not found');
            }

            const sentRequests = requesterData.friendRequests?.sent || [];
            interface SentRequest {
                userId: string;
                timestamp?: number;
            }

            const sentRequestToRemove: SentRequest | undefined =
                sentRequests.find(
                    (req: SentRequest) => req.userId === currentUserId
                );

            if (!sentRequestToRemove) {
                console.warn('Sent request not found on requester side');
                // Still continue with the operation
            }

            const currentUserProfile = {
                id: currentUserId,
                displayName: currentUserData.displayName || 'User',
                email: currentUserData.email || null,
                phoneNumber: currentUserData.phoneNumber || null,
                photoURL: currentUserData.photoURL || null,
            };

            await updateDoc(requesterRef, {
                friends: arrayUnion(currentUserProfile),
                'friendRequests.sent': sentRequestToRemove
                    ? arrayRemove(sentRequestToRemove)
                    : arrayRemove({
                          userId: currentUserId,
                      }),
            });

            // Update Redux state
            dispatch(addFriend(requesterProfile));
            dispatch(removeReceivedFriendRequest(requesterId));

            return Promise.resolve();
        } catch (error) {
            console.error('Error accepting friend request:', error);
            throw error;
        }
    };

// Reject friend request
export const rejectFriendRequest =
    (currentUserId: string, requesterId: string) =>
    async (dispatch: AppDispatch) => {
        try {
            // Remove from current user's received requests
            const currentUserRef = doc(firestore, 'users', currentUserId);
            await updateDoc(currentUserRef, {
                'friendRequests.received': arrayRemove({
                    userId: requesterId,
                }),
            });

            // Remove from requester's sent requests
            const requesterRef = doc(firestore, 'users', requesterId);
            await updateDoc(requesterRef, {
                'friendRequests.sent': arrayRemove({
                    userId: currentUserId,
                }),
            });

            // Update Redux state
            dispatch(removeReceivedFriendRequest(requesterId));
        } catch (error) {
            console.error('Error rejecting friend request:', error);
            throw error;
        }
    };

// Cancel sent friend request
// Cancel sent friend request
export const cancelFriendRequest =
    (currentUserId: string, targetUserId: string) =>
    async (dispatch: AppDispatch) => {
        try {
            // First, get the current user's document to find the exact request object
            const currentUserRef = doc(firestore, 'users', currentUserId);
            const currentUserDoc = await getDoc(currentUserRef);
            const currentUserData = currentUserDoc.data();
            
            if (!currentUserData) {
                throw new Error('Current user profile not found');
            }
            
            // Find the exact sent request object to remove
            const sentRequests = currentUserData.friendRequests?.sent || [];
            interface SentRequest {
                userId: string;
                timestamp?: number;
            }
            const sentRequestToRemove: SentRequest | undefined = sentRequests.find((req: SentRequest) => req.userId === targetUserId);
            
            if (!sentRequestToRemove) {
                console.warn('Sent request not found, using simple object');
                // If not found, try with simple object (fallback)
            }
            
            // Now remove the exact object or fallback to simple object
            await updateDoc(currentUserRef, {
                'friendRequests.sent': sentRequestToRemove ? 
                    arrayRemove(sentRequestToRemove) : 
                    arrayRemove({
                        userId: targetUserId,
                    })
            });
            
            // Do the same for the target user side
            const targetUserRef = doc(firestore, 'users', targetUserId);
            const targetUserDoc = await getDoc(targetUserRef);
            const targetUserData = targetUserDoc.data();
            
            if (!targetUserData) {
                throw new Error('Target user profile not found');
            }
            
            const receivedRequests = targetUserData.friendRequests?.received || [];
            interface ReceivedRequest {
                userId: string;
                timestamp?: number;
                from?: {
                    id: string;
                    displayName: string;
                    email: string | null;
                    phoneNumber: string | null;
                    photoURL: string | null;
                };
            }
            
            const receivedRequestToRemove: ReceivedRequest | undefined = receivedRequests.find((req: ReceivedRequest) => req.userId === currentUserId);
            
            if (!receivedRequestToRemove) {
                console.warn('Received request not found on target side');
                // Still continue with the operation
            }
            
            await updateDoc(targetUserRef, {
                'friendRequests.received': receivedRequestToRemove ? 
                    arrayRemove(receivedRequestToRemove) : 
                    arrayRemove({
                        userId: currentUserId,
                    })
            });
            
            // Update Redux state
            dispatch(removeSentFriendRequest(targetUserId));
            
            return Promise.resolve('Request canceled successfully');
        } catch (error) {
            console.error('Error canceling friend request:', error);
            throw error;
        }
    };
// Fetch user's friends
export const fetchFriends = (userId: string) => (dispatch: AppDispatch) => {
    try {
        const userRef = doc(firestore, 'users', userId);

        return onSnapshot(
            userRef,
            (doc) => {
                if (doc.exists()) {
                    const userData = doc.data();
                    const friends = userData.friends || [];
                    dispatch(setFriends(friends));
                }
            },
            (error) => {
                console.error('Error fetching friends:', error);
            }
        );
    } catch (error) {
        console.error('Error setting up friends listener:', error);
        throw error;
    }
};
