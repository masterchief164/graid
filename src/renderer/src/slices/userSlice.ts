import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LoginStatus } from '../../../shared';

interface UserData {
  email: string;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  rootUser: boolean;
}

interface UserState {
  user: UserData | null;
  accounts: UserData[];
  isLogged: boolean;
  loading: boolean;
  error: string | null;
}

// Define the initial state using that type
const loginStatus = await window.electronAPI.getExistingUser();
const accounts = await window.electronAPI.getAllAccounts();

const initialState: UserState = {
  user: loginStatus.userData,
  isLogged: loginStatus.status === 1,
  loading: false,
  error: null,
  accounts: [...accounts]
};

export const getAccessTokens = createAsyncThunk<LoginStatus, string>(
  'user/getAccessTokens',
  async (code: string) => {
    return await window.electronAPI.getAccessTokens(code);
  }
);

export const updateRootUser = createAsyncThunk<void, string>(
  'user/updateRootUser',
  async (email: string) => {
    return await window.electronAPI.setRootUser(email);
  }
);

const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLogged = false;
      state.loading = false;
      state.error = null;
      state.accounts = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAccessTokens.fulfilled, (state, action) => {
      if (action.payload.status === 1) {
        if (action.payload.userData?.rootUser) {
          state.user = action.payload.userData;
        }
        state.isLogged = true;
        state.loading = false;
        state.error = null;
        state.accounts = [...state.accounts, action.payload.userData!];
      } else {
        state.loading = false;
        state.error = 'Login Failed';
      }
    });
  }
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
