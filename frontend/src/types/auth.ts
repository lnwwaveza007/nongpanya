export interface User {
  id: string;
  email: string;
  fullname: string;
  role: string;
}

export interface AuthContextType {
  authenticated: boolean;
  loading: boolean;
  user?: User;
}
