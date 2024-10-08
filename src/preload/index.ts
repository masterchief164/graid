import { contextBridge, ipcRenderer } from 'electron';
import { RaidConfig } from '../main/services/RaidConfigService';

// Custom APIs for renderer
const api = {
  startGoogleLogin: (state: string): void => ipcRenderer.send('startGoogleLogin', state),
  generateEntropy: (length: number): Promise<string> =>
    ipcRenderer.invoke('generateEntropy', length),
  getAccessTokens: (code: string) => ipcRenderer.invoke('getAccessTokens', code),
  navigate: (callback: (path: string) => void) =>
    ipcRenderer.on('navigate', (_event, path) => callback(path)),
  getExistingUser: () => ipcRenderer.invoke('getExistingUser'),
  getAllAccounts: () => ipcRenderer.invoke('getAllAccounts'),
  getRootUser: () => ipcRenderer.invoke('getRootUser'),
  getRaidConfig: () => ipcRenderer.invoke('getRaidConfig'),
  setRaidConfig: (raidConfig: RaidConfig) => ipcRenderer.invoke('setRaidConfig', raidConfig)
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api;
}
