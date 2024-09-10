abstract class RaidService {
  abstract addFile: (file: string) => void;
  abstract deleteFile: (file: string) => void;
  abstract getFiles: () => string[];
  abstract updateFile: (oldFile: string, newFile: string) => void;
  abstract createDirectory: (directory: string) => void;
  abstract deleteDirectory: (directory: string) => void;
  abstract getDirectories: () => string[];
  abstract updateDirectory: (oldDirectory: string, newDirectory: string) => void;
  abstract getDirectoryView: (directory: string) => string;
}

export default RaidService;
