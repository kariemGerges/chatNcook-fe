import React, {
    useState,
    useMemo,
    useCallback,
    useRef,
    useEffect,
} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    Platform,
    Animated,
    Alert,
    KeyboardAvoidingView,
    ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { StatusSelector } from '@/app/screens/profileScreen/StatusSelector';
import {
    profileSchema,
    type ProfileData,
    type ValidationErrors,
} from '@/app/screens/profileScreen/validation';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

import { router } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';

const defaultProfileData: ProfileData = {
    name: '',
    email: '',
    phoneNumber: '',
    bio: '',
    status: 'Available',
    avatar: '',
    contacts: [],
    createdAt: { '': '' },
    lastOnline: { '': 0 },
    pushToken: '',
    settings: {
        notificationsEnabled: true,
    },
    uid: '',
};

const MobileProfile = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [isEditing, setIsEditing] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
        {}
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Getting user data from redux slice
    const { user, profileData, loading, userError } = useSelector(
        (state: RootState) => state.user
    );

    // Initialize profileImage with default value
    const [profileImage, setProfileImage] = useState<string | null>(
        profileData?.avatar ?? null
    );

    // Initialize profile and editableProfile with default values
    const [profile, setProfile] = useState<ProfileData>(defaultProfileData);
    const [editableProfile, setEditableProfile] =
        useState<ProfileData>(defaultProfileData);

    // Update profile when profileData changes
    useEffect(() => {
        if (profileData) {
            setProfile(profileData);
            setEditableProfile(profileData);
        }
    }, [profileData]);

    // redirect to login screen if user is not logged in
    useEffect(() => {
        if (!loading && !user) {
            router.replace('/screens/LoginScreen');
        }
    }, [loading, user, profileData, router]);

    // A Helper function to get the initials from the name
    const getInitials = useCallback((name: string) => {
        return name
            ?.split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }, []);

    // Status options NOT THE DATABASE YET❌
    // This is just for the UI
    const statusOptions = useMemo(
        () => [
            { label: 'Available' as const, color: '#22c55e' },
            { label: 'Busy' as const, color: '#ef4444' },
            { label: 'Away' as const, color: '#eab308' },
        ],
        []
    );

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    // Validate data for use editing NOT THE DATABASE YET ❌
    const validateField = useCallback(
        (field: keyof ProfileData, value: string) => {
            try {
                profileSchema.shape[field].parse(value);
                setValidationErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                });
            } catch (error) {
                if (error instanceof z.ZodError) {
                    setValidationErrors((prev) => ({
                        ...prev,
                        [field]: error.errors[0].message,
                    }));
                }
            }
        },
        []
    );

    // Save data to the state (NOT THE DATABASE YET) ❌
    const handleSave = async () => {
        try {
            setIsSubmitting(true);
            const validatedProfile = profileSchema.parse(editableProfile);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setProfile(validatedProfile);
            setIsEditing(false);
            setValidationErrors({});
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: ValidationErrors = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        errors[err.path[0] as keyof ValidationErrors] =
                            err.message;
                    }
                });
                setValidationErrors(errors);
                Alert.alert(
                    error.message,
                    'Validation Error - Please fix the errors before saving.'
                );
                console.error(error);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Cancel editing by user
    const handleCancel = () => {
        setEditableProfile(profile);
        setIsEditing(false);
        setValidationErrors({});
    };

    // handle sign out
    const handleSignOut = async () => {
        const auth = getAuth(); // Get the current Firebase Auth instance

        try {
            await signOut(auth); // Sign out the user
            console.log('User signed out successfully');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // Image picker to change profile photo but not the database yet (NOT THE DATABASE YET) ❌
    const pickImage = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'Please grant camera roll permissions to change your profile photo.'
            );
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                setProfileImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    // Take photo to change profile photo but not the database yet
    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'Please grant camera permissions to take a profile photo.'
            );
            return;
        }

        try {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                setProfileImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to take photo');
        }
    };

    const showImageOptions = () => {
        Alert.alert(
            'Change Profile Photo',
            'Choose an option',
            [
                {
                    text: 'Take Photo',
                    onPress: takePhoto,
                },
                {
                    text: 'Choose from Library',
                    onPress: pickImage,
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

    // Render validation errors to the UI
    const renderValidationError = (field: keyof ProfileData) => {
        if (validationErrors[field]) {
            return (
                <Text style={styles.errorText}>{validationErrors[field]}</Text>
            );
        }
        return null;
    };

    // Render info rows to the UI if editing by user
    const renderInfoRow = (
        icon: string,
        title: string,
        value: string,
        field: keyof ProfileData
    ) => (
        <View style={styles.infoRowContainer}>
            <Text style={styles.infoLabel}>{title}</Text>
            <View style={styles.infoRow}>
                <Ionicons
                    name={icon as any}
                    size={22}
                    color="#6366f1"
                    style={styles.infoIcon}
                />
                {isEditing ? (
                    <TextInput
                        value={editableProfile[field] as string}
                        onChangeText={(text) => {
                            setEditableProfile((prev) => ({
                                ...prev,
                                [field]: text,
                            }));
                            validateField(field, text);
                        }}
                        style={[
                            styles.input,
                            validationErrors[field]
                                ? styles.inputError
                                : undefined,
                        ]}
                        placeholder={`Enter ${field}`}
                        editable={!isSubmitting}
                        placeholderTextColor="#a1a1aa"
                    />
                ) : (
                    <Text style={styles.infoText}>
                        {value || `No ${field} provided`}
                    </Text>
                )}
            </View>
            {renderValidationError(field)}
        </View>
    );

    // Handle loading and error states
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <LinearGradient
                    colors={['#6366f1', '#818cf8']}
                    style={styles.loadingGradient}
                >
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={styles.loadingText}>Loading Your profile...</Text>
                </LinearGradient>
            </View>
        );
    }

    if (userError) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons
                    name="alert-circle-outline"
                    size={64}
                    color="#ef4444"
                />
                <Text style={styles.errorTitle}>Error Loading Profile</Text>
                <Text style={styles.errorMessage}>{userError}</Text>
                <TouchableOpacity
                    style={styles.errorButton}
                    onPress={() => router.replace('/screens/LoginScreen')}
                >
                    <Text style={styles.errorButtonText}>Go to Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="light" />
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                <LinearGradient
                    colors={['#FF9966', '#FF5E62']}
                    style={styles.header}
                >
                    <View style={styles.headerActions}>
                        <TouchableOpacity
                            onPress={() => handleSignOut()}
                            style={styles.signOutButton}
                            disabled={isSubmitting}
                        >
                            <Ionicons
                                name="log-out-outline"
                                size={24}
                                color="#ffffff"
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.profileImageContainer}>
                        <Animated.View
                            style={[styles.imageWrapper, { opacity: fadeAnim }]}
                        >
                            {profileImage ? (
                                <Image
                                    source={
                                        profileImage
                                            ? { uri: profileImage }
                                            : {
                                                    uri: 'https://via.placeholder.com/120',
                                            }
                                    }
                                    style={styles.profileImage}
                                />
                            ) : (
                                <View style={styles.initialsContainer}>
                                    <Text style={styles.initialsText}>
                                        {getInitials(profileData?.name || '') || 'Guest'}
                                    </Text>
                                </View>
                            )}

                            {isEditing && (
                                <TouchableOpacity
                                    style={styles.cameraButton}
                                    onPress={showImageOptions}
                                    disabled={isSubmitting}
                                >
                                    <Ionicons
                                        name="camera"
                                        size={22}
                                        color="#6366f1"
                                    />
                                </TouchableOpacity>
                            )}
                        </Animated.View>
                    </View>
                </LinearGradient>

                <View style={styles.content}>
                    <View style={styles.profileInfo}>
                        <View style={styles.nameStatusContainer}>
                            <View style={styles.nameEditContainer}>
                                {isEditing ? (
                                    <>
                                        <TextInput
                                            value={editableProfile.name}
                                            onChangeText={(text) => {
                                                setEditableProfile((prev) => ({
                                                    ...prev,
                                                    name: text,
                                                }));
                                                validateField('name', text);
                                            }}
                                            style={[
                                                styles.nameInput,
                                                validationErrors.name
                                                    ? styles.inputError
                                                    : undefined,
                                            ]}
                                            placeholder="Enter name"
                                            editable={!isSubmitting}
                                            placeholderTextColor="#a1a1aa"
                                        />
                                        {renderValidationError('name')}
                                    </>
                                ) : (
                                    <Text style={styles.name}>
                                        {profile.name}
                                    </Text>
                                )}

                                {!isEditing ? (
                                    <TouchableOpacity
                                        onPress={() => setIsEditing(true)}
                                        style={styles.editButton}
                                        disabled={isSubmitting}
                                    >
                                        <Ionicons
                                            name="pencil"
                                            size={18}
                                            color="#6366f1"
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.editActions}>
                                        <TouchableOpacity
                                            onPress={handleSave}
                                            style={[
                                                styles.saveButton,
                                                isSubmitting &&
                                                    styles.disabledButton,
                                            ]}
                                            disabled={isSubmitting}
                                        >
                                            <Ionicons
                                                name={
                                                    isSubmitting
                                                        ? 'hourglass-outline'
                                                        : 'checkmark'
                                                }
                                                size={18}
                                                color="#ffffff"
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={handleCancel}
                                            style={[
                                                styles.cancelButton,
                                                isSubmitting &&
                                                    styles.disabledButton,
                                            ]}
                                            disabled={isSubmitting}
                                        >
                                            <Ionicons
                                                name="close"
                                                size={18}
                                                color="#ffffff"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>

                            {isEditing ? (
                                <View style={styles.statusSelectorContainer}>
                                    <Text style={styles.statusLabel}>
                                        Status:
                                    </Text>
                                    <StatusSelector
                                        selected={editableProfile.status}
                                        onSelect={(status) =>
                                            setEditableProfile((prev) => ({
                                                ...prev,
                                                status,
                                            }))
                                        }
                                        options={statusOptions}
                                    />
                                </View>
                            ) : (
                                <View style={styles.statusContainer}>
                                    <View
                                        style={[
                                            styles.statusDot,
                                            {
                                                backgroundColor:
                                                    statusOptions.find(
                                                        (s) =>
                                                            s.label ===
                                                            profile.status
                                                    )?.color,
                                            },
                                        ]}
                                    />
                                    <Text style={styles.statusText}>
                                        {profile.status}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.sectionTitle}>
                            Contact Information
                        </Text>
                        {renderInfoRow(
                            'mail-outline',
                            'Email',
                            profile.email,
                            'email'
                        )}
                        {renderInfoRow(
                            'call-outline',
                            'Phone',
                            profile.phoneNumber ?? '',
                            'phoneNumber'
                        )}

                        <View style={styles.bioContainer}>
                            <Text style={styles.sectionTitle}>About</Text>
                            {isEditing ? (
                                <>
                                    <TextInput
                                        value={editableProfile.bio}
                                        onChangeText={(text) => {
                                            setEditableProfile((prev) => ({
                                                ...prev,
                                                bio: text,
                                            }));
                                            validateField('bio', text);
                                        }}
                                        style={[
                                            styles.bioInput,
                                            validationErrors.bio
                                                ? styles.inputError
                                                : undefined,
                                        ]}
                                        multiline
                                        numberOfLines={4}
                                        placeholder="Tell us about yourself"
                                        editable={!isSubmitting}
                                        placeholderTextColor="#a1a1aa"
                                    />
                                    {renderValidationError('bio')}
                                </>
                            ) : (
                                <View style={styles.bioTextContainer}>
                                    <Text style={styles.bioText}>
                                        {profile.bio ||
                                            'No bio provided. Tell us about yourself!'}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingGradient: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#ffffff',
        marginTop: 16,
        fontSize: 16,
        fontWeight: '500',
    },
    header: {
        height: 220,
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    headerActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
    },
    signOutButton: {
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginTop: -40,
    },
    imageWrapper: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.0005,
        shadowRadius: 12,
        elevation: 8,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#fff',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    content: {
        marginTop: -40,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    profileInfo: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 20,
    },
    nameStatusContainer: {
        alignItems: 'center',
    },
    nameEditContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
        marginRight: 8,
    },
    nameInput: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
        borderBottomWidth: 2,
        borderBottomColor: '#e5e7eb',
        paddingBottom: 4,
        textAlign: 'center',
        minWidth: 150,
    },
    editButton: {
        padding: 8,
        backgroundColor: '#f3f4f6',
        borderRadius: 20,
    },
    editActions: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    saveButton: {
        padding: 8,
        backgroundColor: '#6366f1',
        borderRadius: 20,
        marginRight: 8,
    },
    cancelButton: {
        padding: 8,
        backgroundColor: '#ef4444',
        borderRadius: 20,
    },
    disabledButton: {
        opacity: 0.5,
    },
    statusSelectorContainer: {
        marginTop: 8,
        alignItems: 'center',
    },
    statusLabel: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 6,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4b5563',
    },
    infoContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 16,
    },
    infoRowContainer: {
        marginBottom: 16,
    },
    infoLabel: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
    infoIcon: {
        marginRight: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 16,
        color: '#4b5563',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#4b5563',
        paddingVertical: 4,
    },
    bioContainer: {
        marginTop: 24,
    },
    bioTextContainer: {
        backgroundColor: '#f9fafb',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 12,
    },
    bioInput: {
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#4b5563',
        minHeight: 120,
        textAlignVertical: 'top',
    },
    bioText: {
        fontSize: 16,
        color: '#4b5563',
        lineHeight: 24,
    },
    inputError: {
        borderWidth: 1,
        borderColor: '#ef4444',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9fafb',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
        marginTop: 16,
        marginBottom: 8,
    },
    errorMessage: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    errorButton: {
        backgroundColor: '#6366f1',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    errorButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    initialsContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialsText: {
        color: '#00000',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default MobileProfile;
