// userThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig';
import { setLoading, setUserError, setProfileData } from '@/store/slices/userSlice';
import { UserData } from '@/assets/types/types';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (uid: string, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    try {
      const userDocRef = doc(firestore, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        dispatch(setProfileData(data));
      } else {
        console.log('No profile data found in Firestore');
        dispatch(setProfileData(null));
      }
      dispatch(setLoading(false));
    } catch (err) {
      const errorMessage = (err as Error).message;
      dispatch(setUserError(errorMessage));
      dispatch(setLoading(false));
      return rejectWithValue(errorMessage);
    }
  }
);
