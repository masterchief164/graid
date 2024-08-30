import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
interface UserData {
  email: string;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

interface UserState {
  user: UserData | null;
  isLogged: boolean;
  loading: boolean;
  error: string | null;
}

// Define the initial state using that type
const initialState: UserState = {
  user: null,
  isLogged: false,
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      state.isLogged = true;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isLogged = false;
      state.loading = false;
      state.error = null;
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout } = userSlice.actions;

export default userSlice.reducer;
