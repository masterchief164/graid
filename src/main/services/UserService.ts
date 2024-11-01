import { getDb } from '../db/db';
import { LoginStatus, UserAuthData, UserData } from '../../shared';
import { EntryStream } from 'level-read-stream';
import { exchangeRefreshToken } from './GoogleLoginService';

const getUser = async (email: string): Promise<UserData> => {
  return JSON.parse(await getDb().get(`user:${email}`));
};

const createUser = async (user: UserData): Promise<void> => {
  // const stream = getUserDb().createKeyStream();
  await getDb().put(`user:${user.email}`, JSON.stringify(user));
};

const getRootUser = async (): Promise<string> => {
  try {
    return await getDb().get('user:root');
  } catch (e: any) {
    return '';
  }
};

const updateRootUser = async (userEmail: string): Promise<void> => {
  await getDb().put('user:root', userEmail);
};

const updateUserAuthData = async (email: string, authData: UserAuthData): Promise<void> => {
  await getDb().put(`auth:${email}`, JSON.stringify(authData));
};

const getUserAuthData = async (email: string): Promise<string> => {
  const authDataString = await getDb().get(`auth:${email}`);
  const userAuthData = JSON.parse(authDataString) as UserAuthData;
  // console.log('userAuthData', userAuthData.exp - new Date().getTime());
  if (userAuthData.exp >= new Date().getTime()) {
    return userAuthData.authToken;
  } else {
    await exchangeRefreshToken(email);
    return await getUserAuthData(email);
  }
};

const updateUserRefreshData = async (email: string, refreshToken: string): Promise<void> => {
  await getDb().put(`refresh:${email}`, refreshToken);
};

const getUserRefreshData = async (email: string): Promise<string> => {
  return await getDb().get(`refresh:${email}`);
};

const checkUserExists = async (email: string): Promise<boolean> => {
  return checkKeyExists(`user:${email}`);
};

const checkKeyExists = async (key: string): Promise<boolean> => {
  try {
    await getDb().get(key);
    return true;
  } catch (e) {
    console.log('error', e);
    return false;
  }
};

const checkRootUserExists = async (): Promise<boolean> => {
  return checkKeyExists('user:root');
};

const getExistingUser = async (): Promise<LoginStatus> => {
  if (!(await checkRootUserExists())) {
    return { status: 0, userData: null };
  }
  const email = await getRootUser();
  const user = await getUser(email);
  return { status: 1, userData: user };
};

const getAllUsers = async (): Promise<UserData[]> => {
  const stream = new EntryStream<string, string>(getDb(), { gte: 'user:', lte: 'user:\uffff' });
  const users: UserData[] = [];
  for await (const { key, value } of stream) {
    if (key === 'user:root') continue;
    users.push(JSON.parse(value));
  }
  return users;
};

export {
  getUser,
  createUser,
  getRootUser,
  updateRootUser,
  getUserAuthData,
  updateUserAuthData,
  checkRootUserExists,
  checkUserExists,
  updateUserRefreshData,
  getUserRefreshData,
  getExistingUser,
  getAllUsers
};
