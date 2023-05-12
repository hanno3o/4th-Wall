import { configureStore } from '@reduxjs/toolkit';
import userReducer, { initialState } from './redux/reducers/userSlice';

test('initial state', () => {
  const store = configureStore({
    reducer: { user: userReducer },
  });

  const state = store.getState().user;

  expect(state).toEqual(initialState);
});