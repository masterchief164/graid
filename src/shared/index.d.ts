export interface UserData {
  email: string;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  rootUser: boolean;
}

export interface LoginStatus {
  status: number;
  userData: UserData | null;
}

export interface UserAuthData {
  authToken: string;
  exp: number;
}

export interface RefreshStatus {
  status: number;
  authToken: string | null;
}
