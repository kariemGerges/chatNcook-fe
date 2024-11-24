import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import store  from "@/store/index";
import { setUser, resetUser } from "@/store/slices/userSlice";
import { fetchUserProfile } from "@/store/thunks/userThunks";

export const listenToAuthChanges = () => {
    onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
            store.dispatch(setUser(authUser));
            store.dispatch(fetchUserProfile(authUser.uid));
        } else {
            store.dispatch(resetUser());
        }
    });
};