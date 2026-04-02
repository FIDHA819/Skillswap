import React, { createContext, useContext, useEffect, useState } from "react";
import { userService, UserProfile } from "../services/userService";

type AuthState = {
  loading: boolean;
  user?: UserProfile | null;
  token?: string | null;
  refresh: () => Promise<void>;
  logout: () => void;
  needsOtp: boolean;
  needsProfile: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const refresh = async () => {
    setLoading(true);
    try {
      if (!token) {
        setUser(null);
        return;
      }
      const profile = await userService.getProfile(token);
      setUser(profile);
    } catch (err) {
      console.error("Auth refresh failed", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const needsOtp = !!token && !(user?.isOtpVerified ?? user?.emailVerified ?? false);
  const needsProfile = !!token && !userService.isProfileComplete(user ?? undefined);
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{ loading, user, token, refresh, logout, needsOtp, needsProfile, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};