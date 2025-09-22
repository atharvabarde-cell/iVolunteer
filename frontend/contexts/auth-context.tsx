"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "user" | "ngo" | "admin"

export interface Badge {
  name: string
  earnedAt: string
}

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
  badges: Badge[]
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("auth-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: UserRole = "user"): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem("auth-user", JSON.stringify(data.user));
        setIsLoading(false);
        return true;
      } else {
        console.error("Login failed:", data.message);
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      console.error("Login failed:", err);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      });
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem("auth-user", JSON.stringify(data.user));
        setIsLoading(false);
        return true;
      } else {
        console.error("Signup failed:", data.message);
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      console.error("Signup failed:", err);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth-user")
    localStorage.removeItem("auth-token")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}