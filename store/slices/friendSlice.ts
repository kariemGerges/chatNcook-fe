import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FriendProfile, FriendState } from '@/assets/types/types';

// initial state for the friend slice
const initialState: FriendState = {
    searchResults: [],
    searchQuery: '',
    searchType: 'email',
    searching: false,
    error: null,
    friends: [],
    friendRequests: {
        sent: [],
        received: [],
    },
};

// This slice manages the state related to friends, including searching for friends, managing friend requests, and maintaining a list of friends.
const friendSlice = createSlice({
    name: 'friend',
    initialState,
    reducers: {
        // Reducers for managing friend-related state
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
        },
        // Sets the type of search to either 'email' or 'phone'
        setSearchType(state, action: PayloadAction<'email' | 'phone'>) {
            state.searchType = action.payload;
        },
        // Sets the search results with an array of friend profiles
        setSearchResults(state, action: PayloadAction<FriendProfile[]>) {
            state.searchResults = action.payload;
        },
        // Clears the search results
        clearSearchResults(state) {
            state.searchResults = [];
        },
        // Sets the loading state for searching
        setSearching(state, action: PayloadAction<boolean>) {
            state.searching = action.payload;
        },
        // Sets the error message for search operations
        setSearchError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        // Sets the complete friends list
        setFriends(state, action: PayloadAction<FriendProfile[]>) {
            state.friends = action.payload;
        },
        // Adds a single friend to the list if not already present
        addFriend(state, action: PayloadAction<FriendProfile>) {
            if (
                !state.friends.some((friend) => friend.id === action.payload.id)
            ) {
                state.friends.push(action.payload);
            }
        },
        // Removes a friend by ID
        removeFriend(state, action: PayloadAction<string>) {
            state.friends = state.friends.filter(
                (friend) => friend.id !== action.payload
            );
        },
        // Friend Request Handlers
        addSentFriendRequest(
            state,
            action: PayloadAction<{ id: string; timestamp: number }>
        ) {
            if (
                !state.friendRequests.sent.some(
                    (request) => request.id === action.payload.id
                )
            ) {
                state.friendRequests.sent.push(action.payload);
            }
        },
        // Adds a new received friend request
        addReceivedFriendRequest(
            state,
            action: PayloadAction<{
                id: string;
                timestamp: number;
                from: FriendProfile;
            }>
        ) {
            if (
                !state.friendRequests.received.some(
                    (request) => request.id === action.payload.id
                )
            ) {
                state.friendRequests.received.push(action.payload);
            }
        },
        // Removes a received request by ID
        removeReceivedFriendRequest(state, action: PayloadAction<string>) {
            state.friendRequests.received =
                state.friendRequests.received.filter(
                    (request) => request.id !== action.payload
                );
        },
        // Removes a sent request by ID
        removeSentFriendRequest(state, action: PayloadAction<string>) {
            state.friendRequests.sent = state.friendRequests.sent.filter(
                (request) => request.id !== action.payload
            );
        },
    },
});

// Exporting actions and reducer
export const {
    setSearchQuery,
    setSearchType,
    setSearchResults,
    clearSearchResults,
    setSearching,
    setSearchError,
    setFriends,
    addFriend,
    removeFriend,
    addSentFriendRequest,
    addReceivedFriendRequest,
    removeReceivedFriendRequest,
    removeSentFriendRequest,
} = friendSlice.actions;

export default friendSlice.reducer;
                            
/**
 * Redux slice for managing friend-related state
 * 
 * @state {FriendState} The state shape includes:
 * - searchResults: Array of friend profiles from search
 * - searchQuery: Current search query string
 * - searchType: Search by 'email' or 'phone'
 * - searching: Boolean loading state for search
 * - error: Error message if any
 * - friends: Array of current friends
 * - friendRequests: Object containing sent and received friend requests
 */

/**
 * Reducers:
 * 
 * setSearchQuery - Updates the search query string
 * setSearchType - Sets search type to either 'email' or 'phone'
 * setSearchResults - Updates array of search results
 * clearSearchResults - Clears all search results
 * setSearching - Updates the searching loading state
 * setSearchError - Sets error message for search operations
 * setFriends - Sets the complete friends list
 * addFriend - Adds a single friend to the list if not already present
 * removeFriend - Removes a friend by ID
 * 
 * Friend Request Handlers:
 * addSentFriendRequest - Adds a new sent friend request
 * addReceivedFriendRequest - Adds a new received friend request
 * removeReceivedFriendRequest - Removes a received request by ID
 * removeSentFriendRequest - Removes a sent request by ID
 */
