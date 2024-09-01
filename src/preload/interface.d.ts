import { LoginStatus, UserData } from '../shared';

export interface IElectronAPI {
  openExternal: (url: string) => void;
  startGoogleLogin: (state: string) => void;
  generateEntropy: (length: number) => Promise<string>;
  getAccessTokens: (code: string) => Promise<LoginStatus>;
  navigate: (callback: (path: string) => void) => void;
  getExistingUser: () => Promise<LoginStatus>;
  getAllAccounts: () => Promise<UserData[]>;
  getRootUser: () => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
