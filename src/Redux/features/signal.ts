"use client"
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface signal {
  value: string | undefined;
}

const initialState: signal = {
  value: '',
};

const updateSignal = createSlice({
  name: 'signal',
  initialState,
  reducers: {
    assignSignal(state ,action: PayloadAction<string>){
        state.value=action.payload;
    }
  },
});

export const {assignSignal} = updateSignal.actions;

export default updateSignal.reducer;
