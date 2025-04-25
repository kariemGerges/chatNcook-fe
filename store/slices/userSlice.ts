import { UserData, UserState } from "@/assets/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";

const initialState: UserState = {
    user: null,
    profileData: null,
    loading: true,
    userError: null,
};


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
            state.loading = false;
            state.userError = null;
        },
        resetUser(state) {
            state.user = null;
            state.profileData = null;
            state.loading = false;
            state.userError = null;
        },
        setProfileData(state, action: PayloadAction<UserData | null>) {
            state.profileData = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setUserError(state, action: PayloadAction<string | null>) {
            state.userError = action.payload;
        },
    },
    
});

export const {
    setUser,
    resetUser,
    setProfileData,
    setLoading,
    setUserError,
} = userSlice.actions;
export default userSlice.reducer;