import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface userState {
  status: 'idle' | 'loading' | 'failed';
  id: string | null;
  email: string | null;
  userName: string | null;
  avatar: string | null;
  registrationDate: number | null;
  dramaList: string[] | null;
}

export const initialState: userState = {
  status: 'idle',
  id: '',
  email: '',
  userName: '',
  avatar: '',
  registrationDate: NaN,
  dramaList: [],
};

export const userSlice = createSlice({
  name: 'user',
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
        dramaList: string[] | null;
      }>
    ) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state.userName = action.payload.userName;
      state.registrationDate = action.payload.registrationDate;
      state.dramaList = action.payload.dramaList;
    },
    updateAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
    updateUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    addToDramaList: (state, action: PayloadAction<string>) => {
      if (state.dramaList === null) {
        state.dramaList = [];
      }
      state.dramaList.push(action.payload);
    },
    removeFromDramaList: (state, action: PayloadAction<string>) => {
      if (state.dramaList === null) {
        state.dramaList = [];
      } else {
        state.dramaList = state.dramaList.filter(
          (dramaId) => dramaId !== action.payload
        );
      }
    },
  },
});

export const {
  setUserInfo,
  updateAvatar,
  updateUserName,
  addToDramaList,
  removeFromDramaList,
} = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
