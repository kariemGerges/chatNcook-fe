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
import { auth } from '@/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface SignUpScreenProps {
  navigation: any; // You should use proper navigation typing from @react-navigation/native
}

const { width, height } = Dimensions.get('window');

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push('/(tabs)');
    } catch (error: any) {
      console.log(error);
      switch (error.code) {
        case 'auth/invalid-credential':
          console.log('That email address is invalid!!!!!');
          setErrorMessage('Email address or password is invalid');
          console.log(errorMessage);
          break;
        case 'auth/operation-not-allowed':
          console.log('Password sign-in is disabled for this Firebase project!');
          setErrorMessage(error.message);
          break;
        case 'wrong-password':
          console.log('The password is invalid!');
          setErrorMessage(error.message);
          break;
        case 'auth/user-not-found':
          console.log('There is no user corresponding to this email.');
          setErrorMessage(error.message);
          break;
        case 'auth/weak-password':
        default:
          console.log('Something went wrong:', error.message);
          setErrorMessage(error.message);
      }
    }
  };

  const handleLogin = () => {
    router.push('/screens/SignupScreen');
  };

  return (
    <ImageBackground
      source={require('@/assets/images/sginup.webp')} // Your background illustration
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
              <Text style={styles.title}>Login</Text>
              
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
                <Text style={styles.signUpButtonText}>Login</Text>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleLogin}>
                  <Text style={styles.loginLink}>Create one</Text>
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