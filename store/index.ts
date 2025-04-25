import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '@/store/slices/chatSlice'
import userReducer from '@/store/slices/userSlice'
import friendReducer from '@/store/slices/friendSlice'

const store = configureStore({
    reducer: {
        chat: chatReducer,
        user: userReducer,
        friend: friendReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;