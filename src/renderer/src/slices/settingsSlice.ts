import { createSlice } from '@reduxjs/toolkit';

// export const raidVersions = ['RAID 0', 'RAID 1', 'RAID 5', 'RAID 6', 'RAID 10'];
export const raidVersions = {
  'RAID 0': 2,
  'RAID 1': 2,
  'RAID 2': 3,
  'RAID 5': 3,
  'RAID 6': 4,
  'RAID 10': 4
};

export type RaidVersionTypes = keyof typeof raidVersions;
interface SettingsState {
  rootUser: string;
  darkMode: boolean;
  raidConfig: RaidVersionTypes;
}
const rootUser = await window.electronAPI.getRootUser();
const initialState: SettingsState = {
  rootUser: rootUser,
  darkMode: true,
  raidConfig: raidVersions[0]
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setRootUser: (state, action) => {
      state.rootUser = action.payload;
    },
    switchTheme: (state) => {
      state.darkMode = !state.darkMode;
    }
  }
});

export const { setRootUser, switchTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
