"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Badge {
  id: string
  icon: string
  color: string
  earned: boolean
  name: string
}

interface AppState {
  userCoins: number
  badges: Badge[]
  dailyQuoteClaimed: boolean
  lastVisitDate: string
  streakCount: number
  totalActivitiesCompleted: number

  addCoins: (amount: number) => void
  earnBadge: (badgeId: string) => void
  claimDailyQuote: () => void
  completeActivity: (activityId: string, coinReward: number) => void
  checkDailyReset: () => void
}

export const useAppState = create<AppState>()(
  persist(
    (set, get) => ({
      userCoins: 0,
      badges: [
        { id: "volunteer", icon: "Heart", color: "text-primary", earned: true, name: "Volunteer Hero" },
        { id: "donor", icon: "Trophy", color: "text-accent", earned: true, name: "Generous Giver" },
        { id: "reader", icon: "Star", color: "text-accent", earned: true, name: "Wisdom Seeker" },
        { id: "community", icon: "Award", color: "text-muted-foreground", earned: false, name: "Community Leader" },
      ],
      dailyQuoteClaimed: false,
      lastVisitDate: "",
      streakCount: 0,
      totalActivitiesCompleted: 0,

      addCoins: (amount) =>
        set((state) => ({
          userCoins: state.userCoins + amount,
        })),

      earnBadge: (badgeId) =>
        set((state) => ({
          badges: state.badges.map((badge) => (badge.id === badgeId ? { ...badge, earned: true } : badge)),
        })),

      claimDailyQuote: () =>
        set((state) => {
          const newCoins = state.userCoins + 10
          return {
            dailyQuoteClaimed: true,
            userCoins: newCoins,
            streakCount: state.streakCount + 1,
          }
        }),

      completeActivity: (activityId, coinReward) =>
        set((state) => {
          const newCoins = state.userCoins + coinReward
          const newTotal = state.totalActivitiesCompleted + 1

          let updatedBadges = [...state.badges]
          if (newTotal >= 5 && !state.badges.find((b) => b.id === "community")?.earned) {
            updatedBadges = updatedBadges.map((badge) =>
              badge.id === "community" ? { ...badge, earned: true } : badge,
            )
          }

          return {
            userCoins: newCoins,
            totalActivitiesCompleted: newTotal,
            badges: updatedBadges,
          }
        }),

      checkDailyReset: () =>
        set((state) => {
          const today = new Date().toDateString()
          if (state.lastVisitDate !== today) {
            return {
              dailyQuoteClaimed: false,
              lastVisitDate: today,
            }
          }
          return state
        }),
    }),
    {
      name: "impact-rewards-storage",
    },
  ),
)