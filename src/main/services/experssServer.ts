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
  res.send('Hello World!');
});

export default expressApp;
