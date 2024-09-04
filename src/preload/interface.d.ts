import { LoginStatus, UserData } from '../shared';
import { RaidConfig } from '../main/services/RaidConfigService';

export interface IElectronAPI {
  openExternal: (url: string) => void;
  startGoogleLogin: (state: string) => void;
  generateEntropy: (length: number) => Promise<string>;
  getAccessTokens: (code: string) => Promise<LoginStatus>;
  navigate: (callback: (path: string) => void) => void;
  getExistingUser: () => Promise<LoginStatus>;
  getAllAccounts: () => Promise<UserData[]>;
  getRootUser: () => Promise<string>;
  setRootUser: (email: string) => Promise<void>;
  getRaidConfig: () => Promise<RaidConfig>;
  setRaidConfig: (raidConfig: RaidConfig) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
