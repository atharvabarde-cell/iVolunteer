"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "user" | "ngo" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
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
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem("auth-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: UserRole = "user"): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call - replace with real authentication later
    await new Promise((resolve) => setTimeout(resolve, 1000))

    let newUser: User

    // Check for default admin account
    if (email === "admin@volunteer.com" && password === "admin123") {
      newUser = {
        id: "admin-001",
        email: "admin@volunteer.com",
        name: "System Admin",
        role: "admin",
        createdAt: new Date().toISOString(),
      }
    } else {
      // For demo purposes, accept any other email/password combination
      newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split("@")[0],
        role,
        createdAt: new Date().toISOString(),
      }
    }

    setUser(newUser)
    localStorage.setItem("auth-user", JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const signup = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
    }

    setUser(newUser)
    localStorage.setItem("auth-user", JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth-user")
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
