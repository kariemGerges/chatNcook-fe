import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { auth, firestore } from '@/firebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';


interface SignUpScreenProps {
  navigation: any; // You should use proper navigation typing from @react-navigation/native
}

const { width, height } = Dimensions.get('window');

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  const createUserProfile = async (userId: string, userData: any) => {
    try {
      const userRef = doc(firestore, 'users', userId);
      await setDoc(userRef, userData);
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email.trim(), password);
      // console.log(`Successfully signed up user: ${userCredentials.user.email}`);
      const user = userCredentials.user;

      if (user) {
        const userData = {
          name: name,
          email: user.email,
          avatar: avatarUrl,
          status: 'Available',
          lastOnline: serverTimestamp(),
          createdAt: serverTimestamp(),
          pushToken: '', // Set this when you have the device token
          phoneNumber: phoneNumber,
          settings: {
            notificationsEnabled: true,
          },
          contacts: [],
        };
        await createUserProfile(user.uid, userData);
      }
      router.push('/(tabs)/chat');
    } catch (error: any) {
      console.log(error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          console.log('That email address is already in use!');
          setErrorMessage('Email address is already in use');
          break;
        case 'auth/invalid-email':
          console.log('That email address is invalid!');
          setErrorMessage('Email address is invalid');
          break;
        case 'auth/operation-not-allowed':
          console.log('Password sign-in is disabled for this Firebase project!');
          break;
        case 'auth/weak-password':
          console.log('The password is too weak!');
          setErrorMessage('The password is too weak');
          break;
        default:
          console.log('Something went wrong:', error.message);
      }
    }
  };

  const handleLogin = () => {
    router.push('/screens/LoginScreen');
  };

  
  return (
    <ImageBackground
      source={require('@/assets/images/sginup.webp')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.contentContainer}>
            {/* Form Container */}
            <View style={styles.formContainer}>
              <Text style={styles.title}>Create Account</Text>

              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#999"
              />

              <TextInput
                style={styles.input}
                placeholder="Avatar URL"
                value={avatarUrl}
                onChangeText={setAvatarUrl}
                placeholderTextColor="#999"
              />

              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholderTextColor="#999"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#999"
              />

              {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}

              <TouchableOpacity 
                style={styles.signUpButton} 
                onPress={handleSignUp}
              >
                <Text style={styles.signUpButtonText}>Sign up</Text>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={handleLogin}>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  container: {
    flex: 1,
    //backgroundColor: 'rgba(251, 229, 192, 0.85)', // Semi-transparent warm overlay
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(251, 229, 192, 0.91)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.35,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: '#FF6B3D', // Orange color from the design
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#FF6B3D',
    fontWeight: '600',
  },
  errorMessage: {
    color: 'red',
    margin: 10,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SignUpScreen;