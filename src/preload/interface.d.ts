export interface IElectronAPI {
  openExternal: (url: string) => void;
  startGoogleLogin: (state: string) => void;
  generateEntropy: (length: number) => Promise<string>;
  getAccessTokens: (code: string) => Promise<number>;
  navigate: (callback: (path: string) => void) => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
