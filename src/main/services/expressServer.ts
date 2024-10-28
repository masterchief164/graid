import express from 'express';
import { getDriveFilesList } from './DriveService/DriveService';
const expressApp = express();
const port = 2500;

expressApp.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

expressApp.get('/', (_, res) => {
  getDriveFilesList('shaswat2001.sg@gmail.com');
  // getDriveAbout('rishugupta2001.rg@gmail.com');
  // createFileResumable('shaswat2001.sg@gmail.com', 'Nema.mkv', 'Nema.mkv');
  // createFolder('shaswat2001.sg@gmail.com', 'Test Folder');
  // const fileMetaData: FileMetaData = {
  //   name: 'Test Folder',
  //   mimeType: 'application/vnd.google-apps.folder'
  // };
  // checkIfItemExists('shaswat2001.sg@gmail.com', fileMetaData);
  res.send('Hello World!');
});

export default expressApp;
