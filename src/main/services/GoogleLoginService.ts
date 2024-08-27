import { openExternal } from '../../preload/utils/common';
import * as crypto from 'node:crypto';
import { getDb } from '../db/db';
import axios from 'axios';
import { Client_ID, Client_Secret } from '../constants';
import * as jose from 'jose';

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
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.appdata'
  ];
  const params = new URLSearchParams({
    client_id: Client_ID,
    redirect_uri: 'http://localhost:3000/login/google',
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

export const getAccessTokens = async (code: string): Promise<number> => {
  try {
    const payload = {
      client_id: Client_ID,
      client_secret: Client_Secret,
      redirect_uri: 'http://localhost:3000/login/google',
      grant_type: 'authorization_code',
      code: code
    };
    const res = await axios.post('https://oauth2.googleapis.com/token', payload, {});

    const data: claims = jose.decodeJwt(res.data.id_token);
    const email = data.email;
    await getDb().put(`${email}_access_token`, res.data.access_token);
    await getDb().put(`${email}_refresh_token`, res.data.refresh_token);
    await getDb().put(`${email}`, data.toString());

    console.log(email + ' account added successfully'); // todo: bug, this method is called multiple times
    return 1;
  } catch (error: any) {
    console.error('error', error?.response?.data);
    return 0;
  }
};

interface claims {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: number;
  exp: number;
}
