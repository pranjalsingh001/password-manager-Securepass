export interface User {
  email: string;
  id: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  confirmPassword: string;
}

export interface Credential {
  id: string;
  site: string;
  username: string;
  password: string;
  createdAt: string;
}

export interface EncryptedCredential {
  id: string;
  site: string;
  username: string;
  encryptedPassword: string;
  createdAt: string;
}

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  masterPassword: string;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  setMasterPassword: (password: string) => void;
}