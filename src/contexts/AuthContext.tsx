import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import  {jwtDecode}  from 'jwt-decode';

import { User, LoginCredentials, SignupCredentials, AuthContextType } from '../types';

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  masterPassword: '',
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  setMasterPassword: () => {},
});

// Custom hook to use the auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// In a real app, these would be API calls to a backend
// For demo purposes, we're using localStorage to simulate a backend
const mockSignup = async (credentials: SignupCredentials): Promise<{ token: string }> => {
  // Check if user already exists
  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
  if (existingUsers.some((user: User) => user.email === credentials.email)) {
    throw new Error('User already exists');
  }

  // Create new user with hashed password (in a real app, bcrypt would be used on the backend)
  const newUser = {
    id: crypto.randomUUID(),
    email: credentials.email,
    // In a real app, we'd never store the password, only the hash
    passwordHash: credentials.password, 
  };

  // Save the user to localStorage
  localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));
  
  // Create and return a token
  const token = `mock.${btoa(JSON.stringify({ id: newUser.id, email: newUser.email }))}.token`;
  return { token };
};

const mockLogin = async (credentials: LoginCredentials): Promise<{ token: string }> => {
  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Find the user with matching email
  const user = users.find((u: User) => u.email === credentials.email);
  
  // If no user is found or password doesn't match, throw an error
  if (!user || user.passwordHash !== credentials.password) {
    throw new Error('Invalid email or password');
  }
  
  // Create and return a token
  const token = `mock.${btoa(JSON.stringify({ id: user.id, email: user.email }))}.token`;
  return { token };
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [masterPassword, setMasterPassword] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode the token (in a real app, you'd also verify it)
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // If token is invalid, remove it
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      // In a real app, this would be an API call
      const { token } = await mockLogin(credentials);
      
      // Store the token
      localStorage.setItem('token', token);
      
      // Decode the token and set the user
      const decoded = jwtDecode<User>(token);
      setUser(decoded);
      
      // Store the master password in memory (never in localStorage)
      setMasterPassword(credentials.password);
      
      // Redirect to dashboard
      navigate('/dashboard');
      
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to login');
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      // Check if passwords match
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      // In a real app, this would be an API call
      const { token } = await mockSignup(credentials);
      
      // Store the token
      localStorage.setItem('token', token);
      
      // Decode the token and set the user
      const decoded = jwtDecode<User>(token);
      setUser(decoded);
      
      // Store the master password in memory (never in localStorage)
      setMasterPassword(credentials.password);
      
      // Create empty credentials store for new user
      localStorage.setItem(`credentials_${decoded.id}`, JSON.stringify([]));
      
      // Redirect to dashboard
      navigate('/dashboard');
      
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
    }
  };

  const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    
    // Clear the user and master password from state
    setUser(null);
    setMasterPassword('');
    
    // Redirect to login
    navigate('/login');
    
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      masterPassword,
      login,
      signup,
      logout,
      setMasterPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};