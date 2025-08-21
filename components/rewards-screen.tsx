"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, Gift, Award, Lock, Sparkles } from "lucide-react"

export function RewardsScreen() {
  const [userCoins] = useState(1250)

  const giftCards = [
    { id: "1", brand: "Swiggy", value: "₹100", cost: 500, image: "🍔" },
    { id: "2", brand: "Zomato", value: "₹150", cost: 750, image: "🍕" },
    { id: "3", brand: "Amazon", value: "₹200", cost: 1000, image: "📦" },
    { id: "4", brand: "Flipkart", value: "₹100", cost: 500, image: "🛒" },
  ]

  const badges = [
    {
      id: "1",
      name: "First Volunteer",
      description: "Complete your first volunteering activity",
      earned: true,
      icon: "🌟",
    },
    { id: "2", name: "Generous Heart", description: "Make your first donation", earned: true, icon: "❤️" },
    { id: "3", name: "Community Builder", description: "Volunteer 5 times", earned: false, icon: "🏗️" },
    { id: "4", name: "Reading Enthusiast", description: "Read 10 religious texts", earned: false, icon: "📚" },
    { id: "5", name: "Impact Champion", description: "Earn 5000 coins", earned: false, icon: "🏆" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">Your Rewards</h1>
          <div className="flex items-center space-x-1 bg-accent/10 px-3 py-1 rounded-full">
            <Coins className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-foreground">{userCoins}</span>
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        <Tabs defaultValue="vouchers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vouchers" className="flex items-center space-x-2">
              <Gift className="w-4 h-4" />
              <span>Vouchers</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Badges</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vouchers" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {giftCards.map((card) => (
                <Card key={card.id} className="p-4 relative overflow-hidden">
                  <div className="text-center space-y-2">
                    <div className="text-3xl">{card.image}</div>
                    <h3 className="font-semibold text-foreground">{card.brand}</h3>
                    <p className="text-lg font-bold text-accent">{card.value}</p>
                    <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
                      <Coins className="w-3 h-3" />
                      <span>{card.cost} coins</span>
                    </div>
                    <Button size="sm" className="w-full" disabled={userCoins < card.cost}>
                      {userCoins >= card.cost ? "Redeem" : "Not enough coins"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="badges" className="mt-4">
            <div className="space-y-3">
              {badges.map((badge) => (
                <Card key={badge.id} className={`p-4 ${badge.earned ? "bg-accent/5" : "opacity-60"}`}>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        badge.earned ? "bg-accent/20 animate-sparkle" : "bg-muted"
                      }`}
                    >
                      {badge.earned ? badge.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${badge.earned ? "text-foreground" : "text-muted-foreground"}`}>
                        {badge.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </div>
                    {badge.earned && (
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Earned
                      </Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
