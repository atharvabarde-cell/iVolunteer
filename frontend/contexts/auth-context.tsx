"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export type UserRole = "user" | "ngo" | "admin" | "corporate";

export interface User {
  _id: string
  id: string
  email: string
  name: string
  role: UserRole
  points: number
  coins: number
  volunteeredHours: number
  totalRewards: number
  completedEvents: string[]
  createdAt: string
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("auth-user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setIsLoading(false);
  }, []);

  interface AuthResponse {
    user: {
      userId: string;
      email: string;
      name: string;
      role: UserRole;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
    message: string;
  }

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data } = await axios.post<AuthResponse>(
        "http://localhost:5000/api/v1/auth/register",
        { name, email, password, role },
        { withCredentials: true } // if your backend uses cookies for JWT
      );

      // Map the response user to our User interface
      const mappedUser: User = {
        _id: data.user.userId,
        id: data.user.userId,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        points: 0,
        coins: 0,
        volunteeredHours: 0,
        totalRewards: 0,
        completedEvents: [],
        createdAt: new Date().toISOString()
      };

      setUser(mappedUser);
      localStorage.setItem("auth-user", JSON.stringify(mappedUser));
      if (data.tokens) {
        localStorage.setItem("auth-token", data.tokens.accessToken);
        localStorage.setItem("refresh-token", data.tokens.refreshToken);
      }
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error(
        "Signup failed:",
        err.response?.data?.message || err.message
      );
      setIsLoading(false);
      return false;
    }
  };

  const login = async (
    email: string,
    password: string,
    role: UserRole = "user"
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data } = await axios.post<AuthResponse>(
        "http://localhost:5000/api/v1/auth/login",
        { email, password, role },
        { withCredentials: true }
      );

      // Map the response user to our User interface
      const mappedUser: User = {
        _id: data.user.userId,
        id: data.user.userId,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        points: 0,
        coins: 0,
        volunteeredHours: 0,
        totalRewards: 0,
        completedEvents: [],
        createdAt: new Date().toISOString()
      };

      setUser(mappedUser);
      localStorage.setItem("auth-user", JSON.stringify(mappedUser));
      localStorage.setItem("auth-token", data.tokens.accessToken);
      localStorage.setItem("refresh-token", data.tokens.refreshToken);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error(
        "Login failed:",
        err.response?.data?.message || err.message
      );
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth-user")
    localStorage.removeItem("auth-token")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
