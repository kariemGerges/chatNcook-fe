import { ViewStyle } from 'react-native';
import { User } from 'firebase/auth';
import { FieldValue, Timestamp } from 'firebase/firestore';

export interface Recipe {
    _id: string;
    id: number;
    title: string;
    description: string;
    image_url: string;
    ingredients: string[];
    preparation_steps: string;
    preparation_time: string;
    country_of_origin: string;
    author: string;
    tags: string[];
    category: string;
    likes: number;
    saved: boolean;
    chefAvatar: string;
}

export interface CarouselProps {
    data: Recipe[];
    autoPlayInterval?: number;
    initialAutoPlay?: boolean;
    cardStyle?: ViewStyle;
    containerStyle?: ViewStyle;
}

export interface UseCarouselRecipeResponse {
    recipe: Recipe[] | [];
    loading: boolean;
    error: string | null; // Use string for better error message handling
    refresh: () => void;
    refreshing: boolean;
}

// respond type coming from the api call
export interface apiResponse {
    recipes: Recipe[];
    loading: boolean;
    error: string | null;
    refreshing: boolean;
    loadMore: () => void;
    refresh: () => void;
}

export type apiResponseRecipeById = {
    recipes: Recipe[];
    loading: boolean;
    error: string | null;
    refreshing: boolean;
    refresh: () => void;
};

// recipe card type
export interface RecipeCardProps {
    recipe: Recipe;
}

export interface CarouselProps {
    data: Recipe[];
    autoPlayInterval?: number;
    initialAutoPlay?: boolean;
    renderItem: (props: { item: any; index: number }) => React.ReactNode;
    containerStyle?: ViewStyle;
}

// user type
export interface UserData {
    avatar: string;
    contacts: string[];
    // createdAt: Record<string, string>;
    createdAt: {
        _seconds: number;
        _nanoseconds: number;
    };
    email: string;
    // lastOnline: Record<string, number>;
    lastOnline: {
        _seconds: number;
        _nanoseconds: number;
    };
    name: string;
    phoneNumber: string;
    pushToken: string;
    settings: {
        notificationsEnabled: boolean;
    };
    bio: string;
    uid: string | undefined;
    status: string;
}

export interface UserProfile {
    user: User | null;
    profileData: UserData | null;
    loading: boolean;
    userError: string | null;
    refetch: () => void;
}

export interface DataChatsAndMessages {
    data: ChatDate | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

// typing
interface TypingUser {
    userId: string;
    timestamp: Date;
}

// chat
export interface Chats {
    id: string;
    admin: string[];
    chatAvatar: string;
    chatName: string;
    createdAt: Date;
    createdBy: string;
    isGroupChat: boolean;
    lastMessage: string;
    lastUpdated: number;
    participants: string[];
    typing: TypingUser[];
    unreadCounts: Map<string, number>;
}

// message type
export interface Message {
    id: string;
    createdAt: number;
    deleted: boolean;
    imageUrl: string;
    readBy: string[];
    system: boolean;
    text: string;
    type: string;
    user: {
        avatar: string;
        name: string;
        uid: string;
    };
    senderId: string;
    edited: boolean;
    editedAt: null;
    reactions: [];
    replyTo: null;
    attachments: [];
    seenBy: [];
    priority: string;
    deliveryStatus: string;
}

// chatDate type that combines the chat and messages
export interface ChatDate {
    chats: Chats[];
    messages: Message[];
}

// redux types
export interface ChatState {
    chats: Chats[];
    messages: Record<string, Message[]>;
    loading: boolean;
    error: string | null;
}

export interface UserState {
    user: User | null;
    profileData: UserData | null;
    loading: boolean;
    userError: string | null;
}

// friend types
export interface FriendProfile {
    id: string;
    displayName: string;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
    lastSeen?: number;
    status?: string;
}

// Extend UserState interface
export interface FriendState {
    searchResults: FriendProfile[];
    searchQuery: string;
    searchType: 'email' | 'phone';
    searching: boolean;
    error: string | null;
    friends: FriendProfile[];
    friendRequests: {
        sent: { id: string; timestamp: number }[];
        received: { id: string; timestamp: number; from: FriendProfile }[];
    };
}

export interface MenuOption {
    label: string;
    route: string;
    color: string;
}

export interface BottomLeftMenuProps {
    buttonText?: string;
    buttonColor?: string;
    iconName?: string;
    prams?: string;
}

export interface FriendRequest {
    id: string;
    userId: string;
    timestamp: number;
    from?: {
        id: string;
        displayName: string;
        email: string | null;
        phoneNumber: string | null;
        photoURL: string | null;
    };
}
