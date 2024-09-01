import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import settingsReducer from './slices/settingsSlice';

const store = configureStore({
  reducer: {
    users: userReducer,
    settings: settingsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
