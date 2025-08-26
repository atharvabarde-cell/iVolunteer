"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth, type UserRole } from "@/contexts/auth-context"
import { Heart, Building2, Shield, Loader2 } from "lucide-react"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<UserRole>("user")
  const [error, setError] = useState("")

  const { login, signup, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill in all fields")
      return
    }

    try {
      let success = false
      if (isLogin) {
        success = await login(email, password, role)
      } else {
        success = await signup(email, password, name, role)
      }

      if (success) {
        if (role === 'ngo') {
          router.push('/ngo-dashboard');
        } else if (role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        setError("Authentication failed. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  const roleOptions = [
    { value: "user", label: "Volunteer", icon: Heart, description: "Join events and make a difference" },
    { value: "ngo", label: "NGO", icon: Building2, description: "Create events and manage volunteers" },
    { value: "admin", label: "Admin", icon: Shield, description: "Manage all events and users" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Impact Rewards</CardTitle>
          <CardDescription>
            {isLogin ? "Welcome back! Sign in to continue." : "Join our community and start making an impact."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={isLogin ? "login" : "signup"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" onClick={() => setIsLogin(true)}>
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" onClick={() => setIsLogin(false)}>
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">I am a:</Label>
                  <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => {
                        const Icon = option.icon
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center space-x-2">
                              <Icon className="w-4 h-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role-signup">I am a:</Label>
                  <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => {
                        const Icon = option.icon
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col items-start">
                              <div className="flex items-center space-x-2">
                                <Icon className="w-4 h-4" />
                                <span className="font-medium">{option.label}</span>
                              </div>
                              <span className="text-xs text-muted-foreground ml-6">{option.description}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input
                    id="password-signup"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Demo Mode: For admin, use `admin@volunteer.com` / `admin123`</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}