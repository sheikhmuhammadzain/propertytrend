import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// User interface
interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  getToken: () => string | null;
  getStoredUser: () => User | null;
  saveToken: (token: string) => void;
  removeToken: () => void;
  checkToken: () => boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token management constants
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = getToken();
      const storedUser = getStoredUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
      
    };

    initializeAuth();
  }, []);

  // Get token from localStorage
  const getToken = (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  // Save token to localStorage
  const saveToken = (authToken: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, authToken);
      setToken(authToken);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  // Remove token from localStorage
  const removeToken = (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  // Check if token exists and is valid
  const checkToken = (): boolean => {
    const storedToken = getToken();
    return !!storedToken && storedToken.length > 0;
  };

  // Get user from localStorage
  const getStoredUser = (): User | null => {
    try {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  };

  // Save user to localStorage
  const saveUser = (userData: User): void => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Remove user from localStorage
  const removeUser = (): void => {
    try {
      localStorage.removeItem(USER_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  // Login function
  const login = (authToken: string, userData: User): void => {
    saveToken(authToken);
    saveUser(userData);
  };

  // Logout function
  const logout = (): void => {
    removeToken();
    removeUser();
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    getToken,
    saveToken,
    removeToken,
    getStoredUser,
    checkToken,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;