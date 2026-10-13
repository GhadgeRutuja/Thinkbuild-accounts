import { Permission, Module, Action, MODULES } from './permission.model';

export type { Permission, Module, Action };
export { MODULES };

export interface UserInfo {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: UserInfo | null;
  permissions: Record<string, Permission>;
  accessToken: string | null;
  refreshToken: string | null;
}
