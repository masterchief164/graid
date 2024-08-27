import { generateEntropy, getAccessTokens, startGoogleLogin } from './services/GoogleLoginService';

export const initializeHandlers = (ipcMain: Electron.IpcMain): void => {
  ipcMain.handle('generateEntropy', (_, length: number) => generateEntropy(length));
  ipcMain.on('startGoogleLogin', (_, state: string) => {
    startGoogleLogin(state);
  });
  ipcMain.handle('getAccessTokens', (_, code: string) => {
    return getAccessTokens(code);
  });
};
