import { getUserAuthData } from '../UserService';
import axios from 'axios';

const getDriveFilesList = async (email: string) => {
  const userAuthToken: string = await getUserAuthData(email);

  try {
    const req = await axios.get('https://www.googleapis.com/drive/v3/files', {
      headers: {
        Authorization: `Bearer ${userAuthToken}`
      }
    });
    const res = req.data;
    console.log('DriveService.ts: getDriveAbout: res', res);
  } catch (error: any) {
    console.log('DriveService.ts: getDriveAbout: error', error.message);
  }
};

export { getDriveFilesList };
