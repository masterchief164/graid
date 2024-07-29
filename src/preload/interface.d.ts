export interface IElectronAPI {
  openExternal: (url: string) => void;
  startGoogleLogin: (state: string) => void;
  generateEntropy: (length: number) => string;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
