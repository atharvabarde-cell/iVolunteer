"use client"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Heart, Calendar } from "lucide-react"
import { useAppState } from "@/hooks/use-app-state"
import { Navigation } from "@/components/navigation"
import { useEvents } from "@/contexts/events-context"
import { useAuth } from "@/contexts/auth-context"

export default function VolunteerPage() {
  const { addCoins, addBadge } = useAppState()
  const { events, applyToEvent, getApplicationsByUser } = useEvents()
  const { user } = useAuth()

  // Get approved events only
  const approvedEvents = events.filter((event) => event.status === "approved")

  // Get user's applications
  const userApplications = user ? getApplicationsByUser(user.id) : []
  const appliedEventIds = userApplications.map((app) => app.eventId)

  const handleJoinEvent = (eventId: string, coins: number) => {
    if (!user) {
      alert("Please login to apply for events")
      return
    }

    if (!appliedEventIds.includes(eventId)) {
      applyToEvent(eventId, user.id, user.name, user.email)
      addCoins(coins)
      addBadge({
        id: `volunteer-${eventId}`,
        name: "Volunteer Hero",
        description: "Applied to a volunteer event",
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

          {approvedEvents.length === 0 ? (
            <Card className="border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Events Available</h3>
                <p className="text-muted-foreground text-center">Check back later for new volunteer opportunities!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {approvedEvents.map((event) => (
                <Card key={event.id} className="border-border">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription className="text-primary font-medium">{event.organization}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-accent text-accent-foreground">
                        {event.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{event.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {event.participants}/{event.maxParticipants} participants
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-accent font-semibold">
                        <span className="text-lg">🪙</span>
                        {event.coins} coins
                      </div>
                      <Button
                        onClick={() => handleJoinEvent(event.id, event.coins)}
                        disabled={appliedEventIds.includes(event.id) || event.participants >= event.maxParticipants}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {appliedEventIds.includes(event.id) ? (
                          <>
                            <Heart className="w-4 h-4 mr-2" />
                            Applied
                          </>
                        ) : event.participants >= event.maxParticipants ? (
                          "Event Full"
                        ) : (
                          "Apply to Event"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Navigation />
    </div>
  )
}
