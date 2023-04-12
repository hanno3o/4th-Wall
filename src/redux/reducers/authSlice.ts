import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface authState {
  status: 'idle' | 'loading' | 'failed';
  email: string | null;
  userName: string | null;
  avatar: string | null;
  registrationDate: number | null;
}

const initialState: authState = {
  status: 'idle',
  email: '',
  userName: '',
  avatar: '',
  registrationDate: NaN,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInfo: (
      state,
      action: PayloadAction<{
        avatar: string | null;
        email: string | null;
        userName: string | null;
        registrationDate: number | null;
      }>
    ) => {
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state.userName = action.payload.userName;
      state.registrationDate = action.payload.registrationDate;
    },
  },
});

export const { setUserInfo } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
