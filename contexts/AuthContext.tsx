import { userService } from '@/services/userService';
import { User } from '@/types';
import { User as FirebaseUser } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserData: (updates: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = userService.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const data = await userService.getUserProfile(firebaseUser.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await userService.signInWithEmail(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      await userService.registerWithEmail(email, password, name);
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async (idToken: string) => {
    try {
      await userService.signInWithGoogle(idToken);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await userService.signOut();
    } catch (error) {
      throw error;
    }
  };

  const updateUserData = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    try {
      await userService.updateProfile(user.uid, updates);
      if (userData) {
        setUserData({ ...userData, ...updates });
      }
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async () => {
    if (!user) throw new Error('No user logged in');
    try {
      await userService.deleteAccount(user.uid);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateUserData,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 