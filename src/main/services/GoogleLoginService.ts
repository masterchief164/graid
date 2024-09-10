import { openExternal } from '../../preload/utils/common';
import * as crypto from 'node:crypto';
import { getDb } from '../db/db';
import axios from 'axios';
import { Client_ID, Client_Secret } from '../constants';
import * as jose from 'jose';
import { LoginStatus, RefreshStatus, UserData } from '../../shared';
import {
  checkRootUserExists,
  createUser,
  getRootUser,
  getUserRefreshData,
  updateRootUser,
  updateUserAuthData,
  updateUserRefreshData
} from './UserService';

export const startGoogleLogin = (state: string): void => {
  generateUrl(state).then((url) => {
    openExternal(url);
  });
};

const generateUrl = async (state: string): Promise<string> => {
  const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const entropy = await generateEntropy(64);
  const codeChallenge = generateCodeChallenge(entropy).replace('=', '');
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid',
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.file'
  ];
  const params = new URLSearchParams({
    client_id: Client_ID,
    redirect_uri: 'http://localhost:2500/login/google',
    response_type: 'code',
    scope: scopes.join(' '),
    code_challenge_method: 'S256',
    state,
    access_type: 'offline'
  }).toString();
  return `${baseUrl}?$code_challenge=${codeChallenge}&${params}`;
};

export const generateEntropy = async (length: number): Promise<string> => {
  const entropy = crypto.randomBytes(length).toString('hex');
  await getDb().put('entropy', entropy);
  return entropy;
};

const generateCodeChallenge = (entropy: string): string => {
  return crypto.createHash('sha256').update(entropy).digest('base64');
};

export const getAccessTokens = async (code: string): Promise<LoginStatus> => {
  console.log('accesstokencode', code);
  try {
    const payload = {
      client_id: Client_ID,
      client_secret: Client_Secret,
      redirect_uri: 'http://localhost:2500/login/google',
      grant_type: 'authorization_code',
      code: code
    };
    const res = await axios.post('https://oauth2.googleapis.com/token', payload, {});

    const data: UserData = jose.decodeJwt(res.data.id_token);
    const email = data.email;

    if (!(await checkRootUserExists())) {
      await updateRootUser(email);
    }
    const userAuthData = {
      authToken: res.data.access_token,
      exp: res.data.exp
    };
    await updateUserAuthData(email, userAuthData);
    await updateUserRefreshData(email, res.data.refresh_token);
    await createUser(data);

    console.log(data);
    const rootUser = await getRootUser();
    console.log('rootUser', rootUser);
    const userData: UserData = {
      email: data.email,
      name: data.name,
      at_hash: data.at_hash,
      picture: data.picture,
      given_name: data.given_name,
      family_name: data.family_name,
      rootUser: email === (await getRootUser())
    };

    console.log(email + ' account added successfully');
    return { status: 1, userData };
  } catch (error: any) {
    console.error('error', error?.response?.data);
    return { status: 0, userData: null };
  }
};

export const exchangeRefreshToken = async (email: string): Promise<RefreshStatus> => {
  try {
    const refreshToken = await getUserRefreshData(email);
    const payload = {
      client_id: Client_ID,
      client_secret: Client_Secret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    };
    const res = await axios.post('https://oauth2.googleapis.com/token', payload, {});

    const userAuthData = {
      authToken: res.data.access_token,
      exp: res.data.exp
    };
    await updateUserAuthData(email, userAuthData);

    return { status: 1, authToken: res.data.access_token };
  } catch (error: any) {
    console.error('error', error?.response?.data);
    return { status: 0, authToken: null };
  }
};
