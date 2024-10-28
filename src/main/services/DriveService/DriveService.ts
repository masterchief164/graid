import { getUserAuthData, getUserRefreshData } from '../UserService';

import axios from 'axios';
import fs from 'node:fs';
import { auth, drive } from '@googleapis/drive';

const getOAuth2Client = async (email: string) => {
  const userAuthToken: string = await getUserAuthData(email);
  const userRefreshToken: string = await getUserRefreshData(email);
  const oAuth2Client = new auth.OAuth2();
  oAuth2Client.setCredentials({ access_token: userAuthToken, refresh_token: userRefreshToken });
  return oAuth2Client;
};

const getDriveFilesList = async (email: string) => {
  const oAuth2Client = await getOAuth2Client(email);
  try {
    const list = await drive({ version: 'v3', auth: oAuth2Client }).files.list({});
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

export { getDriveFilesList, createFileResumable };
