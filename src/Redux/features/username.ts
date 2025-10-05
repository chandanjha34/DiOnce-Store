"use client"
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface username {
  value: string | undefined;
}

const initialState: username = {
  value: '',
};

const updateUsername = createSlice({
  name: 'username',
  initialState,
  reducers: {
    assignUsername(state ,action: PayloadAction<string>){
        state.value=action.payload;
    }
  },
});

export const {assignUsername} = updateUsername.actions;

export default updateUsername.reducer;
