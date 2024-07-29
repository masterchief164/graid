import { shell } from 'electron';

export const openExternal = (url: string): void => {
  shell.openExternal(url);
};
