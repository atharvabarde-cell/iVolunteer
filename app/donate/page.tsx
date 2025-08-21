"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, Users, BookOpen, Utensils } from "lucide-react"
import { useAppState } from "@/hooks/use-app-state"
import { Navigation } from "@/components/navigation"

export default function DonatePage() {
  const { addCoins, addBadge } = useAppState()
  const [donations, setDonations] = useState<string[]>([])
  const [customAmount, setCustomAmount] = useState("")

  const donationCauses = [
    {
      id: "education",
      title: "Education for All",
      organization: "Global Education Fund",
      description: "Help provide quality education to underprivileged children worldwide",
      icon: BookOpen,
      raised: 45000,
      goal: 100000,
      category: "Education",
      multiplier: 1.5,
    },
    {
      id: "hunger",
      title: "Fight Against Hunger",
      organization: "World Food Initiative",
      description: "Provide meals to families facing food insecurity",
      icon: Utensils,
      raised: 78000,
      goal: 120000,
      category: "Hunger Relief",
      multiplier: 2.0,
    },
    {
      id: "healthcare",
      title: "Healthcare Access",
      organization: "Medical Aid International",
      description: "Bring medical care to remote and underserved communities",
      icon: Heart,
      raised: 32000,
      goal: 80000,
      category: "Healthcare",
      multiplier: 1.8,
    },
    {
      id: "disaster",
      title: "Disaster Relief Fund",
      organization: "Emergency Response Network",
      description: "Provide immediate aid to disaster-affected communities",
      icon: Users,
      raised: 15000,
      goal: 50000,
      category: "Emergency",
      multiplier: 2.5,
    },
  ]

  const quickAmounts = [10, 25, 50, 100]

  const handleDonate = (causeId: string, amount: number, multiplier: number) => {
    const coinsEarned = Math.floor(amount * multiplier)
    setDonations([...donations, `${causeId}-${amount}`])
    addCoins(coinsEarned)
    addBadge({
      id: `donor-${causeId}`,
      name: "Generous Heart",
      description: `Donated $${amount} to a worthy cause`,
      icon: "💝",
      earnedAt: new Date(),
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 pb-20">
        <div className="mt-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Make a Donation</h1>
          <p className="text-muted-foreground mb-6">Support causes you care about and earn rewards</p>

          <div className="space-y-6">
            {donationCauses.map((cause) => {
              const Icon = cause.icon
              const progressPercentage = (cause.raised / cause.goal) * 100

              return (
                <Card key={cause.id} className="border-border">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-lg">{cause.title}</CardTitle>
                          <Badge variant="secondary" className="bg-accent text-accent-foreground">
                            {cause.category}
                          </Badge>
                        </div>
                        <CardDescription className="text-primary font-medium mb-2">
                          {cause.organization}
                        </CardDescription>
                        <p className="text-muted-foreground text-sm">{cause.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          ${cause.raised.toLocaleString()} / ${cause.goal.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-2">
                        {quickAmounts.map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => handleDonate(cause.id, amount, cause.multiplier)}
                            className="flex-1"
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Custom amount"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={() => {
                            const amount = Number.parseInt(customAmount)
                            if (amount > 0) {
                              handleDonate(cause.id, amount, cause.multiplier)
                              setCustomAmount("")
                            }
                          }}
                          disabled={!customAmount || Number.parseInt(customAmount) <= 0}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Donate
                        </Button>
                      </div>

                      <div className="text-center text-sm text-muted-foreground">
                        <span className="text-accent font-semibold">🪙 {cause.multiplier}x coins</span> per dollar
                        donated
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  )
}
