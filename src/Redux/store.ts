'use client'
import { configureStore } from '@reduxjs/toolkit';
import assignReducer from '../Redux/features/username'
import signalReducer from '../Redux/features/signal'

export const store = configureStore({
    reducer: {
        username:assignReducer,
        signal:signalReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
