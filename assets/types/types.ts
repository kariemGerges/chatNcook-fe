import { ViewStyle } from "react-native";
import { User } from "firebase/auth";

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
    createdAt: Record<string, string>;
    email: string;
    lastOnline: Record<string, number>;
    name: string;
    phoneNumber: string;
    pushToken: string;
    settings: {
      notificationsEnabled: boolean;
    };
    bio: string;
    uid: string;
    status: string;
    
  }


  export interface UserProfile {
    user: User | null;
    profileData: UserData | null;
    loading: boolean;
    error: string | null;
  }