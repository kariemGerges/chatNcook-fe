import { ViewStyle } from "react-native";
import { User } from "firebase/auth";
import { FieldValue, Timestamp } from "firebase/firestore";

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
  }
  
  // mockData.ts
  export const mockRecipes: Recipe[] = [
    {
      _id: '1',
      id: 1,
      title: 'Spaghetti Carbonara',
      description: 'Classic Italian pasta dish with eggs, cheese, pancetta, and pepper',
      image_url: 'https://example.com/carbonara.jpg',
      ingredients: ['spaghetti', 'eggs', 'pecorino cheese', 'pancetta', 'black pepper'],
      preparation_steps: 'Cook pasta, mix eggs with cheese...',
      preparation_time: '25 minutes',
      country_of_origin: 'Italy',
      author: 'Chef John',
      tags: ['pasta', 'italian', 'quick'],
      category: 'Main Course'
    },
    {
      _id: '2',
      id: 2,
      title: 'Caesar Salad',
      description: 'Fresh romaine lettuce with classic Caesar dressing',
      image_url: 'https://example.com/caesar.jpg',
      ingredients: ['romaine lettuce', 'croutons', 'parmesan', 'caesar dressing'],
      preparation_steps: 'Wash lettuce, prepare dressing...',
      preparation_time: '15 minutes',
      country_of_origin: 'Mexico',
      author: 'Chef Maria',
      tags: ['salad', 'quick', 'healthy'],
      category: 'Salad'
    }
  ];
  
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
}


  export interface ChatItem {
        id: string;
        name: string;
        message: string;
        time: string;
        unread: boolean;
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
    userError:  string | null;
    refetch: () => void;
  }

  export interface DataChatsAndMessages {
    data: ChatDate | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
  }

  // chat type
  
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