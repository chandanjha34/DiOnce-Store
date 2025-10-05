'use client'
import { configureStore } from '@reduxjs/toolkit';
import assignReducer from '../Redux/features/username'

export const store = configureStore({
    reducer: {
        username:assignReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
