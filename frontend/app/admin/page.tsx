"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Clock, Users, Check, X, Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useEvents } from "@/contexts/events-context"

export default function AdminPanel() {
  const { user } = useAuth()
  const { events, approveEvent, rejectEvent } = useEvents()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/auth")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null
  }

  const pendingEvents = events.filter((event) => event.status === "pending")
  const approvedEvents = events.filter((event) => event.status === "approved")
  const rejectedEvents = events.filter((event) => event.status === "rejected")

  const handleApprove = (eventId: string) => {
    approveEvent(eventId)
  }

  const handleReject = (eventId: string) => {
    rejectEvent(eventId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const EventCard = ({ event, showActions = false }: { event: any; showActions?: boolean }) => (
    <Card key={event.id} className="border-border">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <CardDescription className="text-primary font-medium">{event.organization}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              {event.category}
            </Badge>
            <Badge className={getStatusColor(event.status)}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{event.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
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
            Max {event.maxParticipants} participants
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-accent font-semibold">
            <span className="text-lg">🪙</span>
            {event.coins} coins reward
          </div>
          {showActions && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                onClick={() => handleApprove(event.id)}
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                onClick={() => handleReject(event.id)}
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          )}
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          Created: {new Date(event.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 pb-20">
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-muted-foreground">Manage and approve volunteer events</p>
            </div>
          </div>

          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="relative">
                Pending
                {pendingEvents.length > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full bg-yellow-500 text-white text-xs p-0 flex items-center justify-center">
                    {pendingEvents.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedEvents.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedEvents.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4 mt-6">
              {pendingEvents.length === 0 ? (
                <Card className="border-border">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Check className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Pending Events</h3>
                    <p className="text-muted-foreground text-center">All events have been reviewed!</p>
                  </CardContent>
                </Card>
              ) : (
                pendingEvents.map((event) => <EventCard key={event.id} event={event} showActions={true} />)
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4 mt-6">
              {approvedEvents.length === 0 ? (
                <Card className="border-border">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Check className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Approved Events</h3>
                    <p className="text-muted-foreground text-center">Approved events will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                approvedEvents.map((event) => <EventCard key={event.id} event={event} />)
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4 mt-6">
              {rejectedEvents.length === 0 ? (
                <Card className="border-border">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <X className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Rejected Events</h3>
                    <p className="text-muted-foreground text-center">Rejected events will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                rejectedEvents.map((event) => <EventCard key={event.id} event={event} />)
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Navigation />
    </div>
  )
}
