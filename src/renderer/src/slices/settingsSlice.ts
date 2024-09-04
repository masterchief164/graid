import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const raidVersions = {
  'RAID 0': 2,
  'RAID 1': 2,
  'RAID 2': 3,
  'RAID 5': 3,
  'RAID 6': 4,
  'RAID 10': 4
};

export type RaidVersionTypes = keyof typeof raidVersions;
export type RaidConfig = {
  raidVersion: RaidVersionTypes;
  blockSize: number;
};

interface SettingsState {
  rootUser: string;
  darkMode: boolean;
  raidConfig: RaidConfig;
}
const rootUser = await window.electronAPI.getRootUser();
const initialRaidConfig = await window.electronAPI.getRaidConfig();
const initialState: SettingsState = {
  rootUser: rootUser,
  darkMode: true,
  raidConfig: initialRaidConfig
};

export const updateRaidConfig = createAsyncThunk<void, RaidConfig>(
  'settings/updateRaidConfig',
  async (raidConfig: RaidConfig) => {
    return await window.electronAPI.setRaidConfig(raidConfig);
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    switchTheme: (state) => {
      state.darkMode = !state.darkMode;
    }
  }
});

export const { switchTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
