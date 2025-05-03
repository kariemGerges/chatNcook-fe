// app/help.js
import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import {
    ChevronLeft,
    MessageCircle,
    Search,
    Users,
    BookOpen,
    Bell,
    Settings,
} from 'lucide-react-native';

export default function HelpScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <ChevronLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help Center</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeTitle}>
                        Welcome to Chat and Cook!
                    </Text>
                    <Text style={styles.welcomeText}>
                        Your go-to app for discovering new recipes and
                        connecting with food enthusiasts in real-time.
                    </Text>
                </View>

                {/* Help Categories */}
                <View style={styles.categoriesContainer}>
                    <HelpCategory
                        icon={<MessageCircle size={24} color="#FF6B6B" />}
                        title="Chat Features"
                        description="Learn how to use our real-time chat to discuss recipes and cooking tips."
                        items={[
                            'Join topic-based chat rooms',
                            'Create private cooking groups',
                            'Share photos of your dishes',
                            'React to messages with emojis',
                            'Send voice notes for hands-free cooking',
                        ]}
                    />

                    <HelpCategory
                        icon={<Search size={24} color="#4ECDC4" />}
                        title="Recipe Discovery"
                        description="Find exciting new recipes shared by our community and professional chefs."
                        items={[
                            'Search recipes by ingredients',
                            'Filter by dietary preferences',
                            'Save recipes to your cookbook',
                            'Rate and review recipes',
                            'Get personalized recommendations',
                        ]}
                    />

                    <HelpCategory
                        icon={<Users size={24} color="#FFD166" />}
                        title="Community Features"
                        description="Connect with fellow food lovers and build your cooking network."
                        items={[
                            'Follow favorite chefs and cooks',
                            'Join cooking challenges',
                            'Create and share your own recipes',
                            'Attend virtual cooking events',
                            'Participate in Q&A sessions',
                        ]}
                    />

                    <HelpCategory
                        icon={<BookOpen size={24} color="#6A0572" />}
                        title="My Cookbook"
                        description="Organize and access your favorite recipes and collections."
                        items={[
                            'Create custom recipe collections',
                            'Add personal notes to recipes',
                            'Track cooking history',
                            'Set cooking reminders',
                            'Share collections with friends',
                        ]}
                    />

                    <HelpCategory
                        icon={<Bell size={24} color="#F78C6C" />}
                        title="Notifications"
                        description="Stay updated on new recipes, messages, and cooking events."
                        items={[
                            'Customize notification preferences',
                            'Set quiet hours',
                            'Get alerts for trending recipes',
                            'Receive reminders for saved events',
                            'Follow activity from favorite users',
                        ]}
                    />

                    <HelpCategory
                        icon={<Settings size={24} color="#5E60CE" />}
                        title="Account Settings"
                        description="Manage your profile, privacy, and app preferences."
                        items={[
                            'Edit profile information',
                            'Update dietary preferences',
                            'Adjust privacy settings',
                            'Manage connected accounts',
                            'Change language and region',
                        ]}
                    />
                </View>

                {/* Need More Help Section */}
                <View style={styles.needHelpSection}>
                    <Text style={styles.needHelpTitle}>Need more help?</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/screens/SupportScreen')}
                        style={styles.contactButton}>
                        <Text style={styles.contactButtonText}>
                            Contact Support
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.versionText}>Chat and Cook v1.0.3</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Help Category Component
interface HelpCategoryProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    items: string[];
}

function HelpCategory({ icon, title, description, items }: HelpCategoryProps) {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <View style={styles.categoryContainer}>
            <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => setExpanded(!expanded)}
            >
                <View style={styles.categoryTitleContainer}>
                    <View style={styles.iconContainer}>{icon}</View>
                    <Text style={styles.categoryTitle}>{title}</Text>
                </View>
                <Text style={styles.expandButton}>{expanded ? '−' : '+'}</Text>
            </TouchableOpacity>

            <Text style={styles.categoryDescription}>{description}</Text>

            {expanded && (
                <View style={styles.categoryContent}>
                    {items.map((item, index) => (
                        <View key={index} style={styles.helpItem}>
                            <View style={styles.bulletPoint} />
                            <Text style={styles.helpItemText}>{item}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 12,
        color: '#333',
    },
    scrollView: {
        flex: 1,
    },
    welcomeSection: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 16,
        borderRadius: 8,
        marginHorizontal: 16,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    welcomeTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
        color: '#333',
    },
    welcomeText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
    },
    categoriesContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    categoryContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    expandButton: {
        fontSize: 22,
        fontWeight: '700',
        color: '#666',
    },
    categoryDescription: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666',
        marginTop: 8,
        marginLeft: 52,
    },
    categoryContent: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    helpItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    bulletPoint: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#666',
        marginTop: 7,
        marginRight: 10,
    },
    helpItemText: {
        fontSize: 15,
        lineHeight: 20,
        color: '#444',
        flex: 1,
    },
    needHelpSection: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 16,
        backgroundColor: '#f8f9fa',
    },
    needHelpTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: '#333',
    },
    contactButton: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 24,
        marginBottom: 16,
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    versionText: {
        fontSize: 14,
        color: '#888',
    },
});
