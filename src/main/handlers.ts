import { generateEntropy, getAccessTokens, startGoogleLogin } from './services/GoogleLoginService';
import { getExistingUser } from './services/UserService';

export const initializeHandlers = (ipcMain: Electron.IpcMain): void => {
  ipcMain.handle('generateEntropy', (_, length: number) => generateEntropy(length));
  ipcMain.on('startGoogleLogin', (_, state: string) => {
    startGoogleLogin(state);
  });
  ipcMain.handle('getAccessTokens', (_, code: string) => {
    return getAccessTokens(code);
  });
  ipcMain.handle('getExistingUser', () => {
    return getExistingUser();
  });
};
