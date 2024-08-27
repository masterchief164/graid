import { shell } from 'electron';

export const openExternal = (url: string): void => {
  shell.openExternal(url).then(() => {
    console.log('done');
  });
};
