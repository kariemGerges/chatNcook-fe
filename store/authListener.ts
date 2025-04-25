import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import store  from "@/store/index";
import { setUser, resetUser } from "@/store/slices/userSlice";
import { fetchUserProfile } from "@/store/thunks/userThunks";

interface PlainUser {
    uid: string;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    isAnonymous: boolean;
    // metadata: any;
    providerData: any[];
    refreshToken: string;
}
export const listenToAuthChanges = () => {onAuthStateChanged(auth, (authUser) => {
    if (authUser) {
        const plain: PlainUser = {
            uid: authUser.uid,
            displayName: authUser.displayName,
            email: authUser.email,
            phoneNumber: authUser.phoneNumber,
            photoURL: authUser.photoURL,
            emailVerified: authUser.emailVerified,
            isAnonymous: authUser.isAnonymous,
            // metadata: authUser.metadata,
            providerData: authUser.providerData,
            refreshToken: authUser.refreshToken,
        };
        store.dispatch(setUser(plain));
        store.dispatch(fetchUserProfile(plain.uid));
    } else {
        store.dispatch(resetUser());
    }
});
};