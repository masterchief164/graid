export interface UserData {
  email: string;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export interface LoginStatus {
  status: number;
  userData: UserData | null;
}
