import RaidService from './RaidService';

class Raid0Service extends RaidService {
  addFile: (file: string) => void = (file: string) => {
    console.log('Adding file to Raid0: ', file);
  };
  deleteFile: (file: string) => void = (file: string) => {};
  getFiles: () => string[] = () => {
    return [];
  };
  updateFile: (oldFile: string, newFile: string) => void = (oldFile: string, newFile: string) => {};
  createDirectory: (directory: string) => void = (directory: string) => {};
  deleteDirectory: (directory: string) => void = (directory: string) => {};
  getDirectories: () => string[] = () => {
    return [];
  };
  updateDirectory: (oldDirectory: string, newDirectory: string) => void = (
    oldDirectory: string,
    newDirectory: string
  ) => {};
  getDirectoryView: (directory: string) => string = (directory: string) => {};
}

export default Raid0Service;
