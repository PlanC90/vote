import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
  updateWalletAddress: (address: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin' as UserRole,
    password: 'admin123',
    balance: 1000,
    walletAddress: 'xMfokpvpLTKNgbqCJqGXR9rX63uwT2ywzN',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    createdAt: new Date(),
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    role: 'user' as UserRole,
    password: 'user123',
    balance: 500,
    walletAddress: 'xMfokpvpLTKNgbqCJqGXR9rX63uwT2ywzN',
    avatar: 'https://i.pravatar.cc/150?u=user',
    createdAt: new Date(),
  },
];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would be an API call
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error('Invalid credentials');
    }
    
    // Omit password from user object
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user already exists
    if (MOCK_USERS.some(u => u.email === email)) {
      setIsLoading(false);
      throw new Error('User already exists');
    }
    
    // Generate a valid wallet address
    const walletAddress = 'xMfokpvpLTKNgbqCJqGXR9rX63uwT2ywzN';
    
    // In a real app, this would be an API call to register the user
    const newUser = {
      id: Math.random().toString(36).substring(2, 11),
      username,
      email,
      role: 'user' as UserRole,
      balance: 100,
      walletAddress,
      createdAt: new Date(),
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const updateWalletAddress = async (address: string) => {
    if (!user) throw new Error('No user logged in');
    
    // Validate wallet address format (34 characters starting with 'x')
    if (!/^x[A-Za-z0-9]{33}$/.test(address)) {
      throw new Error('Invalid wallet address format. Must be 34 characters starting with "x"');
    }
    
    const updatedUser = { ...user, walletAddress: address };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        updateWalletAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
