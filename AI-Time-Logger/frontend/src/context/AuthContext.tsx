// src/context/AuthContext.tsx (Updated)
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { getCurrentUser } from '../services/apiService'; // Import API function
import { models } from '../types/models'; // Import types

// Define the shape of the context state
interface AuthContextType {
  accessToken: string | null;
  user: models.UserRead | null; // Add user state
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>; // Make login async
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<models.UserRead | null>(null); // Add user state
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch user data and update state
  // useCallback ensures this function reference doesn't change unnecessarily
  const fetchAndSetUser = useCallback(async () => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setAccessToken(storedToken); // Set token first
      try {
        console.log('AuthContext: Validating token by fetching user data...');
        const userData = await getCurrentUser(); // Fetch user data using the token
        setUser(userData); // Set user data
        setAccessToken(storedToken); // Confirm token state
        console.log('AuthContext: Token validated, user set:', userData);
      } catch (error: any) {
        console.error('AuthContext: Failed to fetch user with stored token', error);
        // If /users/me fails (e.g., 401), token is invalid/expired
        localStorage.removeItem('accessToken'); // Clear invalid token
        setAccessToken(null);
        setUser(null);
      }
    } else {
        setAccessToken(null); // Ensure token state is null if nothing in storage
        setUser(null); // Ensure user state is null
    }
    setIsLoading(false); // Finished check
  }, []); // Empty dependency array means this function is created once


  // Check on initial load
  useEffect(() => {
    fetchAndSetUser();
  }, [fetchAndSetUser]); // Run when fetchAndSetUser is available


  const login = async (token: string) => {
    localStorage.setItem('accessToken', token);
    setAccessToken(token); // Set token immediately for responsiveness
    setIsLoading(true); // Set loading while fetching user
    console.log('AuthContext: User logged in, token set. Fetching user data...');
    await fetchAndSetUser(); // Fetch user data immediately after login
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    setUser(null); // Clear user data on logout
    console.log('AuthContext: User logged out, token & user data removed.');
    // Navigation usually handled in the component calling logout
  };

  const isAuthenticated = !!accessToken && !!user; // User is authenticated if we have a token AND user data

  const value = {
    accessToken,
    user, // Provide user data
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  // ... (useAuth hook remains the same) ...
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};