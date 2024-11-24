import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '@/store/slices/chatSlice'
import userReducer from '@/store/slices/userSlice'

const store = configureStore({
    reducer: {
        chat: chatReducer,
        user: userReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;