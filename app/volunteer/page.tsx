"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Heart } from "lucide-react"
import { useAppState } from "@/hooks/use-app-state"
import { Navigation } from "@/components/navigation"

export default function VolunteerPage() {
  const { addCoins, addBadge } = useAppState()
  const [joinedEvents, setJoinedEvents] = useState<string[]>([])

  const volunteerOpportunities = [
    {
      id: "food-bank",
      title: "Food Bank Volunteer",
      organization: "City Food Bank",
      location: "Downtown Community Center",
      time: "Saturday 9:00 AM - 1:00 PM",
      participants: 12,
      maxParticipants: 20,
      coins: 75,
      description: "Help sort and distribute food to families in need",
      category: "Community Service",
    },
    {
      id: "beach-cleanup",
      title: "Beach Cleanup Drive",
      organization: "Ocean Conservation Society",
      location: "Sunset Beach",
      time: "Sunday 7:00 AM - 11:00 AM",
      participants: 8,
      maxParticipants: 15,
      coins: 60,
      description: "Join us in cleaning up our beautiful coastline",
      category: "Environment",
    },
    {
      id: "elderly-care",
      title: "Elderly Care Visit",
      organization: "Golden Years Foundation",
      location: "Sunshine Senior Center",
      time: "Friday 2:00 PM - 5:00 PM",
      participants: 5,
      maxParticipants: 10,
      coins: 80,
      description: "Spend time with elderly residents, play games, and share stories",
      category: "Healthcare",
    },
    {
      id: "tree-planting",
      title: "Tree Planting Initiative",
      organization: "Green Earth Alliance",
      location: "Central Park",
      time: "Saturday 8:00 AM - 12:00 PM",
      participants: 15,
      maxParticipants: 25,
      coins: 65,
      description: "Help plant trees to improve our city's air quality",
      category: "Environment",
    },
  ]

  const handleJoinEvent = (eventId: string, coins: number) => {
    if (!joinedEvents.includes(eventId)) {
      setJoinedEvents([...joinedEvents, eventId])
      addCoins(coins)
      addBadge({
        id: `volunteer-${eventId}`,
        name: "Volunteer Hero",
        description: "Joined a volunteer event",
        icon: "🤝",
        earnedAt: new Date(),
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 pb-20">
        <div className="mt-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Volunteer Opportunities</h1>
          <p className="text-muted-foreground mb-6">Make a difference in your community and earn rewards</p>

          <div className="space-y-4">
            {volunteerOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="border-border">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                      <CardDescription className="text-primary font-medium">{opportunity.organization}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      {opportunity.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{opportunity.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {opportunity.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {opportunity.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {opportunity.participants}/{opportunity.maxParticipants} participants
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-accent font-semibold">
                      <span className="text-lg">🪙</span>
                      {opportunity.coins} coins
                    </div>
                    <Button
                      onClick={() => handleJoinEvent(opportunity.id, opportunity.coins)}
                      disabled={joinedEvents.includes(opportunity.id)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {joinedEvents.includes(opportunity.id) ? (
                        <>
                          <Heart className="w-4 h-4 mr-2" />
                          Joined
                        </>
                      ) : (
                        "Join Event"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  )
}
