import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '@/services/api';

interface User {
  user_id: string;
  user_type: 'buyer' | 'farmer' | 'admin';
  full_name: string;
  email?: string;
  phone_number?: string;
  location?: string;
  is_active: boolean;
}

interface Profile {
  profile_id: string;
  user_id: string;
  bio?: string;
  avatar_url?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
  updateProfile: (profileData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        fetchProfile(userData.user_id);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const profileData = await apiService.getProfile(userId);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // For now, we'll simulate login by finding a user with matching email
      // In a real app, you'd send credentials to backend for validation
      const users = await apiService.getUsers();
      const foundUser = users.find((u: User) => u.email === email);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        await fetchProfile(foundUser.user_id);
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const newUser = await apiService.createUser({
        user_type: userData.userType,
        full_name: userData.fullName,
        email: userData.email,
        phone_number: userData.phoneNumber,
        location: userData.location,
      });

      // Create profile for the user
      await apiService.createProfile({
        user_id: newUser.user_id,
        bio: userData.bio || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        country: userData.country || '',
      });

      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      await fetchProfile(newUser.user_id);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('currentUser');
  };

  const getCurrentUser = async (): Promise<User | null> => {
    return user;
  };

  const updateProfile = async (profileData: any) => {
    if (!user) return;
    
    try {
      const updatedProfile = await apiService.updateProfile(user.user_id, profileData);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    login,
    logout,
    register,
    getCurrentUser,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};