// src/store/selectors/friendSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';


const selectFriendState = (state: RootState) => state.friend;

// This selector retrieves the list of friends from the friend slice of the Redux store
// and returns it as an array of friend objects.
export const selectSearchResults = createSelector(
    [selectFriendState],
    (friendState) => friendState.searchResults
);

// This selector retrieves the search query from the friend slice of the Redux store
// and returns it as a string.
export const selectSearchQuery = createSelector(
    [selectFriendState],
    (friendState) => friendState.searchQuery
);

// This selector retrieves the search type from the friend slice of the Redux store
// and returns it as a string. The search type can be either "friends" or "friendRequests".
export const selectSearchType = createSelector(
    [selectFriendState],
    (friendState) => friendState.searchType
);

// This selector retrieves the loading state from the friend slice of the Redux store
// and returns it as a boolean value. It indicates whether a search operation is currently in progress.
export const selectIsSearching = createSelector(
    [selectFriendState],
    (friendState) => friendState.searching
);

// This selector retrieves the error state from the friend slice of the Redux store
// and returns it as a string. It indicates whether there was an error during the search operation.
export const selectSearchError = createSelector(
    [selectFriendState],
    (friendState) => friendState.error
);

// This selector retrieves the list of friends from the friend slice of the Redux store
// and returns it as an array of friend objects. It is used to display the list of friends in the UI.
export const selectFriends = createSelector(
    [selectFriendState],
    (friendState) => friendState.friends
);

// This selector retrieves the list of friend requests from the friend slice of the Redux store
// and returns it as an array of friend request objects. It is used to display the list of friend requests in the UI.
export const selectFriendRequests = createSelector(
    [selectFriendState],
    (friendState) => friendState.friendRequests
);
