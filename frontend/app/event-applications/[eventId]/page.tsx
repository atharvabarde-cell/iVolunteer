"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Mail, User, Calendar, Check, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useEvents } from "@/contexts/events-context"

export default function EventApplicationsPage() {
  const { user } = useAuth()
  const { events, getApplicationsByEvent, applications } = useEvents()
  const router = useRouter()
  const params = useParams()
  const eventId = params.eventId as string

  const [event, setEvent] = useState<any>(null)
  const [eventApplications, setEventApplications] = useState<any[]>([])

  useEffect(() => {
    if (!user || user.role !== "ngo") {
      router.push("/auth")
      return
    }

    const foundEvent = events.find((e) => e.id === eventId)
    if (!foundEvent) {
      router.push("/ngo-dashboard")
      return
    }

    // Check if this NGO owns this event
    if (foundEvent.organizationId !== user.id) {
      router.push("/ngo-dashboard")
      return
    }

    setEvent(foundEvent)
    const apps = getApplicationsByEvent(eventId)
    setEventApplications(apps)
  }, [user, events, eventId, router, getApplicationsByEvent])

  if (!user || user.role !== "ngo" || !event) {
    return null
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 pb-20">
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Event Applications</h1>
              <p className="text-muted-foreground">{event.title}</p>
            </div>
          </div>

          {/* Event Summary Card */}
          <Card className="border-border mb-6">
            <CardHeader>
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <CardDescription>{event.organization}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <span className="ml-2 font-medium">{event.date}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Time:</span>
                  <span className="ml-2 font-medium">{event.time}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <span className="ml-2 font-medium">{event.location}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Applications:</span>
                  <span className="ml-2 font-medium">
                    {eventApplications.length}/{event.maxParticipants}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications List */}
          <div className="space-y-4">
            {eventApplications.length === 0 ? (
              <Card className="border-border">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <User className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Applications Yet</h3>
                  <p className="text-muted-foreground text-center">
                    Volunteers will appear here when they apply to your event
                  </p>
                </CardContent>
              </Card>
            ) : (
              eventApplications.map((application) => (
                <Card key={application.id} className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(application.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{application.userName}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Mail className="w-4 h-4" />
                            {application.userEmail}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="w-4 h-4" />
                            Applied on {new Date(application.appliedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                        {application.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Summary Stats */}
          {eventApplications.length > 0 && (
            <Card className="border-border mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Application Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{eventApplications.length}</div>
                    <div className="text-sm text-muted-foreground">Total Applications</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {eventApplications.filter((app) => app.status === "accepted").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Accepted</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {eventApplications.filter((app) => app.status === "pending").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Navigation />
    </div>
  )
}
