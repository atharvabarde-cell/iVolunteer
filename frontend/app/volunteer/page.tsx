"use client"
import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Heart, Calendar } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { useEvents } from "@/contexts/events-context"
import { useAuth } from "@/contexts/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function VolunteerPage() {
  const { events, getApplicationsByUser, refreshEvents } = useEvents()
  const { user } = useAuth()

  const [showForm, setShowForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [formData, setFormData] = useState({ fullName: "", phone: "", message: "" })
  const [loading, setLoading] = useState(false)

  // Get approved events only
  const approvedEvents = events.filter((event) => event.status === "approved")

  // Get user's applications (using MongoDB _id)
  const userApplications = user ? getApplicationsByUser(user._id) : []
  const appliedEventIds = userApplications.map((app) => app.eventId)

  const handleJoinEvent = (event: any) => {
    if (!user) {
      alert("Please login to apply for events")
      return
    }
    setSelectedEvent(event)
    setShowForm(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFormSubmit = async () => {
    if (!selectedEvent || !user) return
    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/event-applications/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvent._id, // use MongoDB ID
          userId: user._id,           // use MongoDB ID
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Failed to apply")
      } else {
        alert("Successfully applied! You earned 50 points 🎉")
        refreshEvents?.()
      }
    } catch (err) {
      console.error(err)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
      setShowForm(false)
      setFormData({ fullName: "", phone: "", message: "" })
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
                <Card key={event._id} className="border-border">
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
                        onClick={() => handleJoinEvent(event)}
                        disabled={appliedEventIds.includes(event._id) || event.participants >= event.maxParticipants || loading}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {appliedEventIds.includes(event._id) ? (
                          <>
                            <Heart className="w-4 h-4 mr-2" />
                            Applied
                          </>
                        ) : event.participants >= event.maxParticipants ? (
                          "Event Full"
                        ) : loading ? (
                          "Submitting..."
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

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register for {selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          <Input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleFormChange}
            className="my-2"
          />
          <Input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleFormChange}
            className="my-2"
          />
          <Input
            name="message"
            placeholder="Why do you want to join?"
            value={formData.message}
            onChange={handleFormChange}
            className="my-2"
          />
          <DialogFooter>
            <Button onClick={handleFormSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
