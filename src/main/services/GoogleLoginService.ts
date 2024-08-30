import { openExternal } from '../../preload/utils/common';
import * as crypto from 'node:crypto';
import { getDb } from '../db/db';
import axios from 'axios';
import { Client_ID, Client_Secret } from '../constants';
import * as jose from 'jose';
import { LoginStatus, UserData } from '../../shared';

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
  console.log(Client_ID);
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
    await getDb().put(`${email}_access_token`, res.data.access_token);
    await getDb().put(`${email}_refresh_token`, res.data.refresh_token);
    await getDb().put(`${email}`, data.toString());

    const userData: UserData = {
      email: data.email,
      name: data.name,
      at_hash: data.at_hash,
      picture: data.picture,
      given_name: data.given_name,
      family_name: data.family_name
    };

    console.log(email + ' account added successfully'); // todo: bug, this method is called multiple times
    return { status: 1, userData };
  } catch (error: any) {
    console.error('error', error?.response?.data);
    return { status: 0, userData: null };
  }
};
