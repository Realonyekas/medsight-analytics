import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole, Hospital } from '@/types';
import { mockUsers, mockHospital } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  hospital: Hospital | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  selectRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by role for demo
    const foundUser = mockUsers.find(u => u.role === role) || mockUsers[0];
    
    setUser({
      ...foundUser,
      email,
      role,
    });
    setHospital(mockHospital);
    setIsLoading(false);
    
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setHospital(null);
  }, []);

  const selectRole = useCallback((role: UserRole) => {
    if (user) {
      const roleUser = mockUsers.find(u => u.role === role) || mockUsers[0];
      setUser({
        ...roleUser,
        role,
      });
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        hospital,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        selectRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
