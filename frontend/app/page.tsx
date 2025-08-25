"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import { DailyQuote } from "@/components/daily-quote"
import { ActivityCard } from "@/components/activity-card"
import { Heart, DollarSign, Users, Sparkles, TrendingUp } from "lucide-react"
import { useAppState } from "@/hooks/use-app-state"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { user } = useAuth();
  const { checkDailyReset, userCoins, badges, streakCount } = useAppState();

  useEffect(() => {
    if (user && user.role === 'user') {
      checkDailyReset()
    }
  }, [checkDailyReset, user])

  const activities = [
    {
      id: "volunteer",
      title: "Volunteer",
      description: "Find local NGOs and volunteer opportunities",
      icon: Heart,
      color: "bg-primary",
      coins: 50,
      gradient: "from-primary to-primary/80",
    },
    {
      id: "donate",
      title: "Donate",
      description: "Make a donation and earn rewards",
      icon: DollarSign,
      color: "bg-accent",
      coins: 75,
      gradient: "from-accent to-accent/80",
    },
    {
      id: "community",
      title: "Community Events",
      description: "Join local community activities",
      icon: Users,
      color: "bg-accent",
      coins: 40,
      gradient: "from-accent to-accent/80",
    },
  ]

  // Conditional rendering based on user role
  if (user && user.role !== 'user') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="px-6 pb-24 max-w-md mx-auto text-center mt-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">Welcome, {user.name}</h1>
          <p className="text-muted-foreground text-lg">Your dashboard is ready. Use the navigation below to manage your events.</p>
        </main>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />

      <main className="px-6 pb-24 max-w-md mx-auto">
        <section className="mt-8 mb-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 font-serif">Welcome Back</h1>
            <p className="text-muted-foreground text-lg">Continue your journey of impact</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center luxury-card">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <div className="text-2xl font-bold text-foreground">{userCoins}</div>
              <div className="text-xs text-muted-foreground">Coins</div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center luxury-card">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{streakCount}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center luxury-card">
              <div className="flex items-center justify-center mb-2">
                <Heart className="h-5 w-5 text-accent" />
              </div>
              <div className="text-2xl font-bold text-foreground">{badges.length}</div>
              <div className="text-xs text-muted-foreground">Badges</div>
            </div>
          </div>
        </section>

        <DailyQuote />

        <section className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground font-serif">Activities</h2>
            <div className="h-px bg-gradient-to-r from-border to-transparent flex-1 ml-4"></div>
          </div>

          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <ActivityCard activity={activity} />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 mb-8">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 text-center border border-border/30">
            <Sparkles className="h-8 w-8 text-accent mx-auto mb-3 animate-sparkle" />
            <h3 className="text-lg font-semibold text-foreground mb-2 font-serif">Keep Making Impact</h3>
            <p className="text-muted-foreground text-sm">Every action counts towards building a better world</p>
          </div>
        </section>
      </main>

      <Navigation />
    </div>
  )
}