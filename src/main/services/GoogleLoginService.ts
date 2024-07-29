import { openExternal } from '../../preload/utils/common';
import * as crypto from 'node:crypto';

export const startGoogleLogin = (state: string): void => {
  openExternal(generateUrl(state));
};

const generateUrl = (state: string): string => {
  const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const entropy = generateEntropy(64);
  const codeChallenge = generateCodeChallenge(entropy);
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.appdata'
  ];
  const params = new URLSearchParams({
    client_id: '213863297508-5811drcat6kuff7kh4n81juiq62e19ov.apps.googleusercontent.com',
    redirect_uri: 'graid://login/google', // use a temp frontend to redirect to the app
    response_type: 'code',
    scope: scopes.join(' '),
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
    access_type: 'offline'
  }).toString();
  console.log(params);
  return `${baseUrl}?${params}`;
};

export const generateEntropy = (length: number): string => {
  return crypto.randomBytes(length).toString('hex');
};

const generateCodeChallenge = (entropy: string): string => {
  return crypto.createHash('sha256').update(entropy).digest('base64');
};
