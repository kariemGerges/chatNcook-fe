import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    searchFriends,
    sendFriendRequest,
    cancelFriendRequest,
} from '@/store/thunks/friendThunks';
import {
    setSearchType,
    setSearchQuery,
    clearSearchResults,
} from '@/store/slices/friendSlice';
import {
    selectSearchResults,
    selectSearchType,
    selectSearchQuery,
    selectIsSearching,
    selectFriendRequests,
} from '@/store/selectors/friendSelectors';
import { FriendProfile } from '@/assets/types/types';

const FriendSearchScreen = () => {
    const dispatch = useAppDispatch();
    const searchResults = useAppSelector(selectSearchResults);
    const searchType = useAppSelector(selectSearchType);
    const searchQuery = useAppSelector(selectSearchQuery);
    const isSearching = useAppSelector(selectIsSearching);
    const friendRequests = useAppSelector(selectFriendRequests);

    const currentUser = useAppSelector((state) => state.user.user);

    // Local state to manage input validation
    const [inputError, setInputError] = useState<string | null>(null);

    // Clear search results when component unmounts
    useEffect(() => {
        return () => {
            dispatch(clearSearchResults());
        };
    }, [dispatch]);

    // Handle search type toggle
    const toggleSearchType = () => {
        const newType = searchType === 'email' ? 'phone' : 'email';
        dispatch(setSearchType(newType));
        setInputError(null);
    };

    // Handle search query change
    const handleSearchChange = (text: string) => {
        dispatch(setSearchQuery(text));
        setInputError(null);
    };

    // Validate input before search
    const validateInput = (): boolean => {
        if (!searchQuery.trim()) {
            setInputError('Please enter a search value');
            return false;
        }

        if (searchType === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(searchQuery)) {
                setInputError('Please enter a valid email address');
                return false;
            }
        } else if (searchType === 'phone') {
            // Simple validation - at least 7 digits
            const phoneRegex = /^[+]?[\d\s()-]{7,}$/;
            if (!phoneRegex.test(searchQuery)) {
                setInputError('Please enter a valid phone number');
                return false;
            }
        }

        return true;
    };

    // Handle search submission
    const handleSearch = () => {
        if (validateInput()) {
            dispatch(searchFriends(searchType, searchQuery));
        }
    };

    // Check if a friend request has been sent to this user
    const isRequestSent = (userId: string): boolean => {
        return friendRequests.sent.some((request) => request.id === userId);
    };

    // Send a friend request
    const handleSendRequest = (userId: string) => {
        if (!currentUser?.uid) {
            Alert.alert(
                'Error',
                'You must be logged in to send friend requests'
            );
            return;
        }

        dispatch(sendFriendRequest(currentUser.uid, userId))
            .then(() => {
                Alert.alert('Success', 'Friend request sent successfully');
            })
            .catch((error) => {
                Alert.alert(
                    'Error',
                    `Failed to send friend request: ${error.message}`
                );
            });
    };

    // Cancel a sent friend request
    const handleCancelRequest = (userId: string) => {
        if (!currentUser?.uid) return;

        dispatch(cancelFriendRequest(currentUser.uid, userId))
            .then(() => {
                Alert.alert('Success', 'Friend request canceled');
            })
            .catch((error) => {
                Alert.alert(
                    'Error',
                    `Failed to cancel friend request: ${error.message}`
                );
            });
    };

    // Render each search result item
    const renderItem = ({ item }: { item: FriendProfile }) => {
        const isRequested = isRequestSent(item.id);
        const isSelf = currentUser?.uid === item.id;

        return (
            <View style={styles.resultItem}>
                <Image
                    source={
                        item.photoURL
                            ? { uri: item.photoURL }
                            : require('@/assets/images/24.jpg')
                    }
                    style={styles.avatar}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.displayName}</Text>
                    <Text style={styles.userDetail}>
                        {searchType === 'email' ? item.email : item.phoneNumber}
                    </Text>
                </View>
                {!isSelf && (
                    <TouchableOpacity
                        style={[
                            styles.button,
                            isRequested
                                ? styles.cancelButton
                                : styles.addButton,
                        ]}
                        onPress={() =>
                            isRequested
                                ? handleCancelRequest(item.id)
                                : handleSendRequest(item.id)
                        }
                    >
                        <Text style={styles.buttonText}>
                            {isRequested ? 'Cancel' : 'Add'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={
                            searchType === 'email'
                                ? 'Search by email'
                                : 'Search by phone number'
                        }
                        value={searchQuery}
                        onChangeText={handleSearchChange}
                        keyboardType={
                            searchType === 'email'
                                ? 'email-address'
                                : 'phone-pad'
                        }
                        autoCapitalize="none"
                    />
                    {inputError && (
                        <Text style={styles.errorText}>{inputError}</Text>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.typeButton,
                            searchType === 'email' ? styles.activeType : {},
                        ]}
                        onPress={toggleSearchType}
                    >
                        <Text style={styles.typeButtonText}>Email</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.typeButton,
                            searchType === 'phone' ? styles.activeType : {},
                        ]}
                        onPress={toggleSearchType}
                    >
                        <Text style={styles.typeButtonText}>Phone</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearch}
                    disabled={isSearching}
                >
                    {isSearching ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.searchButtonText}>Search</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.resultsContainer}>
                {searchResults.length > 0 ? (
                    <FlatList
                        data={searchResults}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.resultsList}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        {isSearching ? (
                            <ActivityIndicator size="large" color="#0066cc" />
                        ) : (
                            <>
                                <Text style={styles.emptyStateText}>
                                    {searchQuery.trim()
                                        ? 'No users found matching your search'
                                        : 'Search for friends by email or phone number'}
                                </Text>
                            </>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    searchContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 12,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginTop: 4,
        fontSize: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    typeButton: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginRight: 8,
    },
    activeType: {
        backgroundColor: '#e0e0ff',
        borderColor: '#0066cc',
        borderWidth: 1,
    },
    typeButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    searchButton: {
        height: 48,
        backgroundColor: '#0066cc',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    resultsContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    resultsList: {
        padding: 8,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e0e0e0',
    },
    userInfo: {
        flex: 1,
        marginLeft: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
    },
    userDetail: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: '#0066cc',
    },
    cancelButton: {
        backgroundColor: '#ff6666',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});

export default FriendSearchScreen;
