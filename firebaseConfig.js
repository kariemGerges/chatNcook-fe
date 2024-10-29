import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

const { FIREBASE_APIKEY,
        FIREBASE_AUTHDOMAIN,
        FIREBASE_PROJECTID,
        FIREBASE_STOREAGEBUCKET, 
        FIREBASE_MESSAGINSENDERID,
        FIREBASE_APPID } = Constants.expoConfig.extra;

// Firebase configuration
const firebaseConfig = {
    apiKey: FIREBASE_APIKEY,
    authDomain: FIREBASE_AUTHDOMAIN,
    projectId: FIREBASE_PROJECTID,
    storageBucket: FIREBASE_STOREAGEBUCKET,
    messagingSenderId: FIREBASE_MESSAGINSENDERID,
    appId: FIREBASE_APPID
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export initialized services
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };