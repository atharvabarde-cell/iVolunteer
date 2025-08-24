"use client"

import { useEffect } from "react"
import { Coins, Award, Trophy, Star, Heart, User, LogOut } from "lucide-react"
import { useAppState } from "@/hooks/use-app-state"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

const iconMap = {
  Heart,
  Trophy,
  Star,
  Award,
}

export function Header() {
  const { userCoins, badges, checkDailyReset } = useAppState()
  const { user, logout } = useAuth()

  useEffect(() => {
    checkDailyReset()
  }, [checkDailyReset])

  return (
    <header className="bg-card border-b border-border px-4 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold text-foreground">Impact Rewards</h1>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            // Show user info when logged in
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-accent/10 px-3 py-1 rounded-full">
                <User className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">{user.name}</span>
                <span className="text-xs text-muted-foreground capitalize">({user.role})</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="h-8 w-8 p-0">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            // Show coins and badges when not logged in
            <>
              <div className="flex items-center space-x-1 bg-accent/10 px-3 py-1 rounded-full transition-all duration-300 hover:bg-accent/20">
                <Coins className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-foreground">{userCoins.toLocaleString()}</span>
              </div>

              <div className="flex items-center space-x-1">
                {badges.map((badge, index) => {
                  const IconComponent = iconMap[badge.icon as keyof typeof iconMap]
                  return (
                    <div
                      key={badge.id}
                      className={`w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer ${
                        badge.earned ? "animate-sparkle shadow-sm" : "opacity-50"
                      }`}
                      title={badge.name}
                    >
                      <IconComponent className={`w-3 h-3 ${badge.color}`} />
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
