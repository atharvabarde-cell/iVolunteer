"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronRight, Coins, CheckCircle } from "lucide-react"
import { useAppState } from "@/hooks/use-app-state"
import type { LucideIcon } from "lucide-react"

interface Activity {
  id: string
  title: string
  description: string
  icon: LucideIcon
  color: string
  coins: number | string
  gradient?: string
}

interface ActivityCardProps {
  activity: Activity
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [showCoinReward, setShowCoinReward] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const { completeActivity } = useAppState()

  const IconComponent = activity.icon

  const handlePress = () => {
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)

    if (!isCompleted && typeof activity.coins === "number") {
      setShowCoinReward(true)
      setIsCompleted(true)
      completeActivity(activity.id, activity.coins)

      setTimeout(() => setShowCoinReward(false), 1000)
      setTimeout(() => setIsCompleted(false), 3000) // Reset for demo
    }
  }

  return (
    <div className="relative">
      <Card
        className={`p-6 cursor-pointer transition-all duration-300 luxury-card border-border/30 bg-card/50 backdrop-blur-sm hover:border-accent/30 ${
          isPressed ? "scale-95" : ""
        } ${isCompleted ? "bg-gradient-to-r from-accent/10 to-primary/10 border-accent/40 animate-glow" : ""}`}
        onClick={handlePress}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                isCompleted
                  ? "bg-gradient-to-br from-accent to-accent/80 animate-sparkle"
                  : activity.gradient
                    ? `bg-gradient-to-br ${activity.gradient}`
                    : activity.color
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="w-7 h-7 text-white" />
              ) : (
                <IconComponent className="w-7 h-7 text-white" />
              )}
            </div>

            <div className="flex-1">
              <h3
                className={`text-lg font-semibold transition-colors duration-200 font-serif ${
                  isCompleted ? "text-accent" : "text-foreground"
                }`}
              >
                {activity.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mt-1">{activity.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl bg-accent/10 border border-accent/20 transition-all duration-300 ${
                isCompleted ? "bg-accent/20 border-accent/40 scale-110" : ""
              }`}
            >
              <Coins className={`w-4 h-4 text-accent ${isCompleted ? "animate-sparkle" : ""}`} />
              <span className="text-sm font-semibold text-accent">{activity.coins}</span>
            </div>
            <ChevronRight
              className={`w-5 h-5 text-muted-foreground transition-all duration-300 ${
                isPressed ? "translate-x-1 text-accent" : ""
              }`}
            />
          </div>
        </div>

        {showCoinReward && (
          <div className="absolute -top-2 -right-2 pointer-events-none z-10">
            <div className="flex items-center space-x-1 text-accent font-bold animate-coin-fly bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-accent/30 shadow-lg">
              <span className="text-lg">+{activity.coins}</span>
              <Coins className="w-5 h-5" />
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
