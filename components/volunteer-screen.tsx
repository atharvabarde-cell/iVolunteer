"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Clock, Users } from "lucide-react"

interface NGO {
  id: string
  name: string
  event: string
  description: string
  location: string
  distance: string
  time: string
  participants: number
  category: string
}

export function VolunteerScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    { id: "cleanup", name: "Clean-up Drive", icon: "🌱" },
    { id: "teaching", name: "Teaching", icon: "📚" },
    { id: "animal", name: "Animal Care", icon: "🐾" },
    { id: "elderly", name: "Old Age Home", icon: "👴" },
  ]

  const ngos: NGO[] = [
    {
      id: "1",
      name: "Green Earth Foundation",
      event: "Beach Cleanup Drive",
      description: "Join us for a morning beach cleanup to protect marine life",
      location: "Marina Beach, Chennai",
      distance: "2.3 km",
      time: "Tomorrow, 7:00 AM",
      participants: 45,
      category: "cleanup",
    },
    {
      id: "2",
      name: "Teach for Change",
      event: "Weekend Math Classes",
      description: "Help underprivileged children with basic mathematics",
      location: "Community Center, T. Nagar",
      distance: "1.8 km",
      time: "Saturday, 10:00 AM",
      participants: 12,
      category: "teaching",
    },
  ]

  const filteredNGOs = selectedCategory ? ngos.filter((ngo) => ngo.category === selectedCategory) : ngos

  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">
              {categories.find((c) => c.id === selectedCategory)?.name} Opportunities
            </h1>
          </div>
        </header>

        <main className="px-4 py-4">
          <div className="space-y-4">
            {filteredNGOs.map((ngo) => (
              <Card key={ngo.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{ngo.event}</h3>
                      <p className="text-sm text-accent font-medium">{ngo.name}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {ngo.distance}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">{ngo.description}</p>

                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{ngo.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{ngo.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{ngo.participants} joined</span>
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    Join Event
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-4 py-4">
        <h1 className="text-lg font-semibold text-foreground">Volunteer Opportunities</h1>
        <p className="text-sm text-muted-foreground">Choose a category to find local NGOs</p>
      </header>

      <main className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="text-center space-y-2">
                <div className="text-2xl">{category.icon}</div>
                <h3 className="font-medium text-foreground text-sm">{category.name}</h3>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
