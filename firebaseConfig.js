import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { FIREBASE_APIKEY,
        FIREBASE_AUTHDOMAIN,
        FIREBASE_PROJECTID,
        // FIREBASE_STOREAGEBUCKET, 
        // FIREBASE_MESSAGINSENDERID,
        FIREBASE_APPID } = Constants.expoConfig.extra;


// Check if the environment variables are defined
if (!FIREBASE_APIKEY 
    || !FIREBASE_AUTHDOMAIN 
    || !FIREBASE_PROJECTID 
    // || !FIREBASE_STOREAGEBUCKET 
    // || !FIREBASE_MESSAGINGSENDERID |
    | !FIREBASE_APPID
) {
    throw new Error('Missing Firebase configuration in environment variables');
}
// Check if the environment variables are defined
console.log('FIREBASE_APIKEY:', FIREBASE_APIKEY);

// Firebase configuration
const firebaseConfig = {
    apiKey: FIREBASE_APIKEY,
    authDomain: FIREBASE_AUTHDOMAIN,
    projectId: FIREBASE_PROJECTID,
    // storageBucket: FIREBASE_STOREAGEBUCKET,
    // messagingSenderId: FIREBASE_MESSAGINSENDERID,
    appId: FIREBASE_APPID
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with AsyncStorage persistence
const auth = getApps().length === 0 
    ? initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
    })
    : getAuth(app);

// Initialize Firestore
const firestore = getFirestore(app);

export { app, auth, firestore };