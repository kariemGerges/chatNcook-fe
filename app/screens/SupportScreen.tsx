// app/support.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import {
    ChevronLeft,
    Send,
    CheckCircle2,
    Mail,
    Phone,
    MessageSquare,
    Image as ImageIcon,
    X,
} from 'lucide-react-native';

// Define types for the form data
interface SupportFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
    category: SupportCategory;
}

// Define available support categories
type SupportCategory =
    | 'account'
    | 'recipes'
    | 'chat'
    | 'technical'
    | 'billing'
    | 'other';

// Category information type
interface CategoryInfo {
    label: string;
    icon: React.ReactNode;
    color: string;
}

export default function ContactSupportScreen(): React.ReactNode {
    const router = useRouter();
    const [formData, setFormData] = useState<SupportFormData>({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'technical',
    });
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [attachments, setAttachments] = useState<string[]>([]);

    // Define category options with their respective icons and colors
    const categoryOptions: Record<SupportCategory, CategoryInfo> = {
        account: {
            label: 'Account Issues',
            icon: <MessageSquare size={16} color="#fff" />,
            color: '#4ECDC4',
        },
        recipes: {
            label: 'Recipe Problems',
            icon: <MessageSquare size={16} color="#fff" />,
            color: '#FF6B6B',
        },
        chat: {
            label: 'Chat Support',
            icon: <MessageSquare size={16} color="#fff" />,
            color: '#FFD166',
        },
        technical: {
            label: 'Technical Help',
            icon: <MessageSquare size={16} color="#fff" />,
            color: '#6A0572',
        },
        billing: {
            label: 'Billing Questions',
            icon: <MessageSquare size={16} color="#fff" />,
            color: '#F78C6C',
        },
        other: {
            label: 'Other',
            icon: <MessageSquare size={16} color="#fff" />,
            color: '#5E60CE',
        },
    };

    // Handle input changes
    const handleChange = (
        field: keyof SupportFormData,
        value: string
    ): void => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Handle category selection
    const handleCategorySelect = (category: SupportCategory): void => {
        setFormData((prev) => ({ ...prev, category }));
    };

    // Handle form submission
    const handleSubmit = async (): Promise<void> => {
        // Validate form
        if (!formData.name || !formData.email || !formData.message) {
            Alert.alert(
                'Missing Information',
                'Please fill out all required fields.'
            );
            return;
        }

        if (!formData.email.includes('@') || !formData.email.includes('.')) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        setSubmitting(true);

        try {
            // In a real app, you would send this data to your backend
            await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

            // Successfully submitted
            setSubmitted(true);

            // Reset form after 3 seconds if you want to allow multiple submissions
            setTimeout(() => {
                setSubmitted(false);
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                    category: 'technical',
                });
                setAttachments([]);
            }, 3000);
        } catch (error) {
            Alert.alert(
                'Error',
                'Failed to submit your request. Please try again.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Mock function to add an attachment
    const handleAddAttachment = (): void => {
        // In a real app, you would use image picker
        const newAttachment = `Screenshot_${new Date().getTime()}.jpg`;
        setAttachments((prev) => [...prev, newAttachment]);
    };

    // Remove an attachment
    const handleRemoveAttachment = (index: number): void => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

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
                <Text style={styles.headerTitle}>Contact Support</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    {!submitted ? (
                        <>
                            {/* Contact Options */}
                            <View style={styles.contactOptions}>
                                <TouchableOpacity style={styles.contactOption}>
                                    <View
                                        style={[
                                            styles.contactIconContainer,
                                            { backgroundColor: '#FF6B6B' },
                                        ]}
                                    >
                                        <Mail size={20} color="#fff" />
                                    </View>
                                    <Text style={styles.contactOptionText}>
                                        Email Us
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.contactOption}>
                                    <View
                                        style={[
                                            styles.contactIconContainer,
                                            { backgroundColor: '#4ECDC4' },
                                        ]}
                                    >
                                        <Phone size={20} color="#fff" />
                                    </View>
                                    <Text style={styles.contactOptionText}>
                                        Call Support
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.contactOption,
                                        styles.activeContactOption,
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.contactIconContainer,
                                            { backgroundColor: '#FFD166' },
                                        ]}
                                    >
                                        <MessageSquare size={20} color="#fff" />
                                    </View>
                                    <Text
                                        style={[
                                            styles.contactOptionText,
                                            styles.activeContactOptionText,
                                        ]}
                                    >
                                        Message Us
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Support Form */}
                            <View style={styles.formContainer}>
                                {/* Name Input */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>
                                        Your Name{' '}
                                        <Text style={styles.requiredStar}>
                                            *
                                        </Text>
                                    </Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={formData.name}
                                        onChangeText={(value) =>
                                            handleChange('name', value)
                                        }
                                        placeholder="Enter your full name"
                                        placeholderTextColor="#aaa"
                                    />
                                </View>

                                {/* Email Input */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>
                                        Email Address{' '}
                                        <Text style={styles.requiredStar}>
                                            *
                                        </Text>
                                    </Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={formData.email}
                                        onChangeText={(value) =>
                                            handleChange('email', value)
                                        }
                                        placeholder="your.email@example.com"
                                        placeholderTextColor="#aaa"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>

                                {/* Subject Input */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>
                                        Subject
                                    </Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={formData.subject}
                                        onChangeText={(value) =>
                                            handleChange('subject', value)
                                        }
                                        placeholder="What's your question about?"
                                        placeholderTextColor="#aaa"
                                    />
                                </View>

                                {/* Category Selection */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>
                                        Category{' '}
                                        <Text style={styles.requiredStar}>
                                            *
                                        </Text>
                                    </Text>
                                    <View style={styles.categoryContainer}>
                                        {Object.entries(categoryOptions).map(
                                            ([key, category]) => (
                                                <TouchableOpacity
                                                    key={key}
                                                    style={[
                                                        styles.categoryButton,
                                                        formData.category ===
                                                            key &&
                                                            styles.selectedCategoryButton,
                                                        {
                                                            borderColor:
                                                                category.color,
                                                        },
                                                    ]}
                                                    onPress={() =>
                                                        handleCategorySelect(
                                                            key as SupportCategory
                                                        )
                                                    }
                                                >
                                                    <View
                                                        style={[
                                                            styles.categoryIcon,
                                                            {
                                                                backgroundColor:
                                                                    category.color,
                                                            },
                                                        ]}
                                                    >
                                                        {category.icon}
                                                    </View>
                                                    <Text
                                                        style={[
                                                            styles.categoryText,
                                                            formData.category ===
                                                                key &&
                                                                styles.selectedCategoryText,
                                                        ]}
                                                    >
                                                        {category.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        )}
                                    </View>
                                </View>

                                {/* Message Input */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>
                                        Message{' '}
                                        <Text style={styles.requiredStar}>
                                            *
                                        </Text>
                                    </Text>
                                    <TextInput
                                        style={styles.messageInput}
                                        value={formData.message}
                                        onChangeText={(value) =>
                                            handleChange('message', value)
                                        }
                                        placeholder="Describe your issue in detail"
                                        placeholderTextColor="#aaa"
                                        multiline
                                        textAlignVertical="top"
                                    />
                                </View>

                                {/* Attachments */}
                                <View style={styles.inputGroup}>
                                    <View style={styles.attachmentHeader}>
                                        <Text style={styles.inputLabel}>
                                            Attachments
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.addAttachmentButton}
                                            onPress={handleAddAttachment}
                                        >
                                            <ImageIcon size={16} color="#555" />
                                            <Text
                                                style={styles.addAttachmentText}
                                            >
                                                Add image
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    {attachments.length > 0 && (
                                        <View style={styles.attachmentsList}>
                                            {attachments.map(
                                                (attachment, index) => (
                                                    <View
                                                        key={index}
                                                        style={
                                                            styles.attachmentItem
                                                        }
                                                    >
                                                        <ImageIcon
                                                            size={14}
                                                            color="#555"
                                                        />
                                                        <Text
                                                            style={
                                                                styles.attachmentName
                                                            }
                                                            numberOfLines={1}
                                                        >
                                                            {attachment}
                                                        </Text>
                                                        <TouchableOpacity
                                                            style={
                                                                styles.removeAttachmentButton
                                                            }
                                                            onPress={() =>
                                                                handleRemoveAttachment(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <X
                                                                size={14}
                                                                color="#FF6B6B"
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            )}
                                        </View>
                                    )}
                                </View>

                                {/* Submit Button */}
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={handleSubmit}
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <ActivityIndicator
                                            color="#fff"
                                            size="small"
                                        />
                                    ) : (
                                        <>
                                            <Send
                                                size={16}
                                                color="#fff"
                                                style={styles.submitIcon}
                                            />
                                            <Text
                                                style={styles.submitButtonText}
                                            >
                                                Send Message
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        // Success Message after submission
                        <View style={styles.successContainer}>
                            <View style={styles.successIconContainer}>
                                <CheckCircle2 size={64} color="#4ECDC4" />
                            </View>
                            <Text style={styles.successTitle}>
                                Message Sent!
                            </Text>
                            <Text style={styles.successMessage}>
                                Thank you for contacting us. We've received your
                                message and will get back to you within 24
                                hours.
                            </Text>
                            <Text style={styles.ticketInfo}>
                                Support Ticket: #
                                {Math.floor(Math.random() * 10000)
                                    .toString()
                                    .padStart(4, '0')}
                            </Text>
                            <TouchableOpacity
                                style={styles.returnButton}
                                onPress={() => router.back()}
                            >
                                <Text style={styles.returnButtonText}>
                                    Return to Help Center
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Support Hours Information */}
                    {!submitted && (
                        <View style={styles.supportInfo}>
                            <Text style={styles.supportInfoTitle}>
                                Support Hours
                            </Text>
                            <Text style={styles.supportInfoText}>
                                Our team is available Monday-Friday, 9AM-6PM
                                EST.
                            </Text>
                            <Text style={styles.supportInfoText}>
                                Average response time: 4-6 hours
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    keyboardAvoid: {
        flex: 1,
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
    contactOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
    },
    contactOption: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 8,
    },
    activeContactOption: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    contactIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    contactOptionText: {
        fontSize: 12,
        color: '#555',
        fontWeight: '500',
    },
    activeContactOptionText: {
        color: '#333',
        fontWeight: '600',
    },
    formContainer: {
        padding: 16,
        backgroundColor: '#fff',
        marginTop: 8,
        borderRadius: 8,
        marginHorizontal: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    requiredStar: {
        color: '#FF6B6B',
    },
    textInput: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
        fontSize: 16,
        color: '#333',
    },
    messageInput: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
        fontSize: 16,
        color: '#333',
        minHeight: 120,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 4,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    selectedCategoryButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
    },
    categoryIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#555',
    },
    selectedCategoryText: {
        fontWeight: '600',
        color: '#333',
    },
    attachmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    addAttachmentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
    },
    addAttachmentText: {
        fontSize: 14,
        marginLeft: 4,
        color: '#555',
    },
    attachmentsList: {
        marginTop: 8,
    },
    attachmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    attachmentName: {
        fontSize: 14,
        color: '#333',
        marginLeft: 8,
        flex: 1,
    },
    removeAttachmentButton: {
        padding: 4,
    },
    submitButton: {
        backgroundColor: '#FF6B6B',
        borderRadius: 8,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    submitIcon: {
        marginRight: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    supportInfo: {
        padding: 16,
        marginTop: 16,
        marginHorizontal: 16,
        backgroundColor: '#f0f8ff',
        borderRadius: 8,
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#4ECDC4',
    },
    supportInfoTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    supportInfoText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    successContainer: {
        padding: 24,
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 8,
    },
    successIconContainer: {
        marginBottom: 24,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 16,
        color: '#333',
    },
    successMessage: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
        marginBottom: 24,
        lineHeight: 24,
    },
    ticketInfo: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 24,
    },
    returnButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#4ECDC4',
        borderRadius: 8,
    },
    returnButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
