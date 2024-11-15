import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '@/firebaseConfig';
import { UserData, UserProfile } from '@/assets/types/types';

const useUserProfile = (): UserProfile => {
  const [user, setUser] = useState<User | null>(null); // Authenticated user
  const [profileData, setProfileData] = useState<UserData | null>(null); // Firestore profile data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        try {
          // Fetch additional profile data from Firestore
          const userDocRef = doc(firestore, 'users', authUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setProfileData(userDoc.data() as UserData);
          } else {
            console.log('No profile data found in Firestore');
          }
        } catch (err) {
          console.error('Error fetching user profile data:', err);
          setError((err as Error).message);
        }
      } else {
        setUser(null);
        setProfileData(null);
      }
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return { user, profileData, loading, error };
};

export default useUserProfile;
