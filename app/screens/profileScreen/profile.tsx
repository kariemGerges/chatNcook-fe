import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
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
  ActivityIndicator, // Import ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { StatusSelector } from '@/app/screens/profileScreen/StatusSelector';
import { profileSchema, type ProfileData, type ValidationErrors } from '@/app/screens/profileScreen/validation';
import { UserData } from '@/assets/types/types';
import { z } from 'zod';
import useUserProfileData from '@/hooks/useUserProfileData';
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
  createdAt: {'': ''},
  lastOnline: {'': 0},
  pushToken: '',
  settings: {
    notificationsEnabled: true,
  },
  uid: '',
};

const MobileProfile = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Getting user data
  const { user, profileData, loading, error } = useUserProfileData();
  const [profileImage, setProfileImage] = useState<string | null>(profileData?.avatar ?? null);
  // Initialize profile and editableProfile with default values
  const [profile, setProfile] = useState<ProfileData>(defaultProfileData);
  const [editableProfile, setEditableProfile] = useState<ProfileData>(defaultProfileData);

  // Update profile when profileData changes
  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
      setEditableProfile(profileData);
    }
  }, [profileData]);

  // redirect to login screen if user is not logged in
  useEffect(() => {
    if (!loading && (!user || !profileData)) {
      router.replace('/screens/LoginScreen');
    }
  }, [loading, user, profileData, router]);
  

  // Status options
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

  // Validate data
  const validateField = useCallback((field: keyof ProfileData, value: string) => {
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
  }, []);

  // Save data to the state (NOT THE DATABASE YET)
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
            errors[err.path[0] as keyof ValidationErrors] = err.message;
          }
        });
        setValidationErrors(errors);
        Alert.alert(error.message, 'Validation Error - Please fix the errors before saving.');
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

  // Image picker to change profile photo but not the database yet
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
      return <Text style={styles.errorText}>{validationErrors[field]}</Text>;
    }
    return null;
  };

  // Render info rows to the UI if editing by user
  const renderInfoRow = (icon: string, value: string, field: keyof ProfileData) => (
    <View style={styles.infoRowContainer}>
      <View style={styles.infoRow}>
        <Ionicons name={icon as any} size={20} color="#9ca3af" />
        {isEditing ? (
          <TextInput
            value={editableProfile[field] as string}
            onChangeText={(text) => {
              setEditableProfile((prev) => ({ ...prev, [field]: text }));
              validateField(field, text);
            }}
            style={[styles.input, validationErrors[field] ? styles.inputError : undefined]}
            placeholder={`Enter ${field}`}
            editable={!isSubmitting}
          />
        ) : (
          <Text style={styles.infoText}>{value}</Text>
        )}
      </View>
      {renderValidationError(field)}
    </View>
  );

  // Handle loading and error states
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b5563" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {(error as any).message}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="light" />
      <ScrollView bounces={false}>
        <LinearGradient colors={['#FFEBC6', '#ffcfc6']} style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                profileImage ? { uri: profileImage } : { uri: 'https://via.placeholder.com/120' }
              }
              style={styles.profileImage}
            />
            {isEditing && (
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={showImageOptions}
                disabled={isSubmitting}
              >
                <Ionicons name="camera" size={20} color="#4b5563" />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        <View style={styles.content}>
            <View style={styles.editOUTActions}>
                  <TouchableOpacity
                    onPress={() => handleSignOut()}
                    style={styles.iconButton}
                    disabled={isSubmitting}
                  >
                    <Ionicons name="log-out" size={20} color="#4b5563" />
                  </TouchableOpacity>
            </View>
          <View style={styles.editButtonContainer}>
            {!isEditing ? (
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={styles.iconButton}
                  disabled={isSubmitting}
                >
                  <Ionicons name="pencil" size={20} color="#4b5563" />
                </TouchableOpacity>
            ) : (
              <View style={styles.editActions}>
                <TouchableOpacity
                  onPress={handleSave}
                  style={[styles.iconButton, { marginRight: 8 }]}
                  disabled={isSubmitting}
                >
                  <Ionicons name={isSubmitting ? 'hourglass' : 'checkmark'} size={20} color="#22c55e" />
                </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCancel}
                    style={styles.iconButton}
                    disabled={isSubmitting}
                  >
                  <Ionicons name="close" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.profileInfo}>
            {isEditing ? (
              <>
                <TextInput
                  value={editableProfile.name}
                  onChangeText={(text) => {
                    setEditableProfile((prev) => ({ ...prev, name: text }));
                    validateField('name', text);
                  }}
                  style={[
                    styles.nameInput,
                    validationErrors.name ? styles.inputError : undefined,
                  ]}
                  placeholder="Enter name"
                  editable={!isSubmitting}
                />
                {renderValidationError('name')}
              </>
            ) : (
              <Text style={styles.name}>{profile.name}</Text>
            )}

            {isEditing ? (
              <StatusSelector
                selected={editableProfile.status}
                onSelect={(status) => setEditableProfile((prev) => ({ ...prev, status }))}
                options={statusOptions}
              />
            ) : (
              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: statusOptions.find((s) => s.label === profile.status)?.color },
                  ]}
                />
                <Text style={styles.statusText}>{profile.status}</Text>
              </View>
            )}
          </View>

          <View style={styles.infoContainer}>
            {renderInfoRow('mail', profile.email, 'email')}
            {renderInfoRow('call', profile.phoneNumber ?? '', 'phoneNumber')}

            <View style={styles.bioContainer}>
              {isEditing ? (
                <>
                  <TextInput
                    value={editableProfile.bio}
                    onChangeText={(text) => {
                      setEditableProfile((prev) => ({ ...prev, bio: text }));
                      validateField('bio', text);
                    }}
                    style={[styles.bioInput, validationErrors.bio ? styles.inputError : undefined]}
                    multiline
                    numberOfLines={3}
                    placeholder="Tell us about yourself"
                    editable={!isSubmitting}
                  />
                  {renderValidationError('bio')}
                </>
              ) : (
                <Text style={styles.bioText}>{profile.bio}</Text>
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
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    height: 200,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 60,
  },
  profileImageContainer: {
    position: 'static',
    bottom: -50,
    alignSelf: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  editButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  editActions: {
    flexDirection: 'row',
  },
  editOUTActions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  iconButton: {
    padding: 8,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: '#4b5563',
  },
  statusSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  statusOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  selectedStatus: {
    backgroundColor: '#e5e7eb',
  },
  statusOptionText: {
    fontSize: 12,
    color: '#4b5563',
  },
  infoContainer: {
    gap: 16,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f3f4f6',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,

  },
  infoText: {
    flex: 1,
    color: '#4b5563',
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 4,
    color: '#4b5563',
  },
  bioContainer: {
    marginTop: 8,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  bioText: {
    color: '#6b7280',
    lineHeight: 20,
  },
  infoRowContainer: {
    marginBottom: 12,
  },
  inputError: {
    borderBottomColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});

export default MobileProfile;
