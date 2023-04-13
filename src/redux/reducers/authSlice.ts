import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface authState {
  status: 'idle' | 'loading' | 'failed';
  id: string | null;
  email: string | null;
  userName: string | null;
  avatar: string | null;
  registrationDate: number | null;
}

const initialState: authState = {
  status: 'idle',
  id: '',
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
        id: string | null;
        avatar: string | null;
        email: string | null;
        userName: string | null;
        registrationDate: number | null;
      }>
    ) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state.userName = action.payload.userName;
      state.registrationDate = action.payload.registrationDate;
    },
    updateAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
    updateUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
  },
});

export const { setUserInfo, updateAvatar,updateUserName } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
