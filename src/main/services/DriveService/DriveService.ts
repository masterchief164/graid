import { getUserAuthData } from '../UserService';
import axios, { AxiosResponse } from 'axios';
import fs from 'node:fs';
import { getDb } from '../../db/db';

export interface FileMetaData {
  name: string;
  mimeType: string;
  kind?: string;
  id?: string;
}

const getDriveFilesList = async (email: string) => {
  try {
    const userAuthToken: string = await getUserAuthData(email);
    const list = await axios.get('https://www.googleapis.com/drive/v3/files', {
      headers: {
        Authorization: `Bearer ${userAuthToken}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('DriveService.ts: getDriveFilesList: list', list.data.files);
  } catch (error: any) {
    console.log('DriveService.ts: getDriveAbout: error', error.message);
    console.log(error.response.data);
    console.log(error.response.data.error.errors);
  }
};

const initiateResumableUpload = async (email: string, fileName: string): Promise<string> => {
  const userAuthToken: string = await getUserAuthData(email);
  const fileMetadata = {
    name: fileName
  };
  try {
    const req = await axios.post(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
      {
        ...fileMetadata
      },
      {
        headers: {
          Authorization: `Bearer ${userAuthToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(
      'DriveService.ts: initiateResumableUpload: req.headers.location',
      req.headers.location
    );
    // TODO: save the file url to db for later use
    return req.headers.location;
  } catch (error: any) {
    console.log('DriveService.ts: initiateResumableUpload: error', error.message);
    console.log(error.response.data);
    console.log(error.response.data.error.errors);
    return '';
  }
};

async function createFileResumable(
  userEmail: string,
  fileName: string,
  filePath: string
): Promise<void> {
  const link = await initiateResumableUpload(userEmail, fileName);
  const chunkSize = 256 * 1024;
  const fileStream = fs.createReadStream(filePath, { highWaterMark: chunkSize });
  let offset = 0;
  const fileSize = fs.statSync(filePath).size;
  for await (const chunk of fileStream) {
    const range = `bytes ${offset}-${offset + chunk.length - 1}/${fileSize}`;
    try {
      console.log('ChunkSizes: ' + chunk.length + ' ' + chunkSize);
      await axios.put(link, chunk, {
        headers: {
          'Content-Length': chunk.length,
          'Content-Range': range,
          'Content-Type': 'application/octet-stream'
        }
      });
      console.log('DriveService.ts: createFileResumable: range', range);
      offset += chunk.length;
    } catch (e: any) {
      if (e.response.status === 308) {
        const percentage = (offset / fileSize) * 100;
        console.log(
          'DriveService.ts: createFileResumable: range',
          range,
          `Percentage: ${percentage}%`
        );
        offset += chunk.length;
      } else {
        console.log('DriveService.ts: createFileResumable: range', range);
        console.log('DriveService.ts: createFileResumable: error', e.message);
        console.log('DriveService.ts: createFileResumable: error.response.data', e.response);
        break;
      }
    }
  }
  // while ()
  console.log('DriveService.ts: createFileResumable: file uploaded');
}

const createFileMetaDataOnly = async (
  email: string,
  fileMetadata: FileMetaData
): Promise<FileMetaData | undefined> => {
  try {
    const userAuthToken: string = await getUserAuthData(email);
    const file: AxiosResponse<FileMetaData> = await axios.post(
      'https://www.googleapis.com/drive/v3/files',
      fileMetadata,
      {
        headers: {
          Authorization: `Bearer ${userAuthToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('DriveService.ts: createFile: file', file.data);
    return file.data;
  } catch (error: any) {
    console.log('DriveService.ts: createFile: error', error.message);
    console.log(error.response.data);
    console.log(error.response.data.error.errors);
  }
  return;
};

const createFolder = async (
  email: string,
  folderName: string
): Promise<FileMetaData | undefined> => {
  const fileMetadata: FileMetaData = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder'
  };
  try {
    const file = await createFileMetaDataOnly(email, fileMetadata);
    console.log('DriveService.ts: createFolder: ', file?.name);
    return file;
  } catch (error: any) {
    console.log('DriveService.ts: createFolder: error', error.message);
    console.log(error.response.data);
    console.log(error.response.data.error.errors);
  }
  return;
};

const checkIfItemExists = async (
  email: string,
  fileMetaData: FileMetaData
): Promise<boolean | undefined> => {
  let searchQuery = '';
  searchQuery += fileMetaData.name ? `name = '${fileMetaData.name}'&` : '';
  searchQuery += fileMetaData.mimeType ? `mimeType = '${fileMetaData.mimeType}'&` : '';
  try {
    const userAuthToken: string = await getUserAuthData(email);
    const url = `https://www.googleapis.com/drive/v3/files?q=${searchQuery}`;
    console.log(url);
    const file = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${userAuthToken}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('DriveService.ts: checkIfItemExists: file', file.data);
    return file.data.files.length > 0;
  } catch (error: any) {
    console.log('DriveService.ts: checkIfItemExists: error', error.message);
    console.log(error.response.data);
    console.log(error.response.data.error.errors);
  }
  return;
};

const saveRootFolderId = async (email: string, rootFolderId: string) => {
  try {
    await getDb().put(`user:${email}`, rootFolderId);
  } catch (e) {
    console.log('DriveService.ts: saveRootFolderId: error', e);
  }
}; // TODO: initial task

export {
  getDriveFilesList,
  createFileResumable,
  createFolder,
  checkIfItemExists,
  initiateResumableUpload,
  saveRootFolderId
};
