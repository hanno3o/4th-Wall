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
    SET_USERINFO: (
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
    UPDATE_AVATAR: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
    UPDATE_USERNAME: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    ADD_TO_DRAMALIST: (state, action: PayloadAction<string>) => {
      if (state.dramaList === null) {
        state.dramaList = [];
      }
      state.dramaList.push(action.payload);
    },
    REMOVE_FROM_DRAMALIST: (state, action: PayloadAction<string>) => {
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
  SET_USERINFO,
  UPDATE_AVATAR,
  UPDATE_USERNAME,
  ADD_TO_DRAMALIST,
  REMOVE_FROM_DRAMALIST,
} = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
