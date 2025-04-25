import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import type { Chats } from '@/assets/types/types';

/* basic selectors ──────────────────────────────────────── */
const selectChatArray = (s: RootState) => s.chat.chats;
const selectChatLoading = (s: RootState) => s.chat.loading;
const selectChatError = (s: RootState) => s.chat.error;

/* recent ≤ 3, newest first ─────────────────────────────── */
export const selectRecentChats = createSelector(
    [selectChatArray],
    (chats): Chats[] =>
        [...chats].sort((a, b) => b.lastUpdated - a.lastUpdated).slice(0, 3)
);

/* one bundled “view‑model” object ──────────────────────── */
export const selectRecentChatsVM = createSelector(
    [selectRecentChats, selectChatLoading, selectChatError],
    (recent, loading, error) => ({
        recent,
        loading,
        error,
    })
);
