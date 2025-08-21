"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Star, CheckCircle } from "lucide-react"
import { useAppState } from "@/hooks/use-app-state"
import { Navigation } from "@/components/navigation"

export default function ReadPage() {
  const { addCoins, addBadge } = useAppState()
  const [readingSessions, setReadingSessions] = useState<string[]>([])
  const [currentReading, setCurrentReading] = useState<string | null>(null)

  const religiousBooks = [
    {
      id: "bhagavad-gita",
      title: "Bhagavad Gita",
      author: "Ancient Sanskrit Text",
      description: "A 700-verse Hindu scripture that is part of the epic Mahabharata",
      chapters: 18,
      estimatedTime: "45 min",
      difficulty: "Intermediate",
      coins: 40,
      category: "Hindu Scripture",
    },
    {
      id: "quran",
      title: "The Holy Quran",
      author: "Islamic Scripture",
      description: "The central religious text of Islam, believed to be a revelation from God",
      chapters: 114,
      estimatedTime: "60 min",
      difficulty: "Intermediate",
      coins: 50,
      category: "Islamic Scripture",
    },
    {
      id: "bible",
      title: "The Holy Bible",
      author: "Christian Scripture",
      description: "A collection of religious texts or scriptures sacred to Christians",
      chapters: 66,
      estimatedTime: "90 min",
      difficulty: "Beginner",
      coins: 45,
      category: "Christian Scripture",
    },
    {
      id: "dhammapada",
      title: "The Dhammapada",
      author: "Buddhist Scripture",
      description: "A collection of sayings of the Buddha in verse form",
      chapters: 26,
      estimatedTime: "30 min",
      difficulty: "Beginner",
      coins: 35,
      category: "Buddhist Scripture",
    },
    {
      id: "guru-granth-sahib",
      title: "Guru Granth Sahib",
      author: "Sikh Scripture",
      description: "The central religious scripture of Sikhism",
      chapters: 1430,
      estimatedTime: "75 min",
      difficulty: "Advanced",
      coins: 55,
      category: "Sikh Scripture",
    },
    {
      id: "torah",
      title: "The Torah",
      author: "Jewish Scripture",
      description: "The first five books of the Hebrew Bible",
      chapters: 5,
      estimatedTime: "50 min",
      difficulty: "Intermediate",
      coins: 42,
      category: "Jewish Scripture",
    },
  ]

  const handleStartReading = (bookId: string) => {
    setCurrentReading(bookId)
    // Simulate reading session
    setTimeout(() => {
      const book = religiousBooks.find((b) => b.id === bookId)
      if (book) {
        setReadingSessions([...readingSessions, bookId])
        addCoins(book.coins)
        addBadge({
          id: `reader-${bookId}`,
          name: "Spiritual Reader",
          description: `Completed reading session: ${book.title}`,
          icon: "📖",
          earnedAt: new Date(),
        })
        setCurrentReading(null)
      }
    }, 3000) // 3 second simulation
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
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
          <h1 className="text-2xl font-bold text-foreground mb-2">Religious Reading</h1>
          <p className="text-muted-foreground mb-6">Explore spiritual texts and grow your understanding</p>

          <div className="space-y-4">
            {religiousBooks.map((book) => (
              <Card key={book.id} className="border-border">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{book.title}</CardTitle>
                        <CardDescription className="text-primary font-medium">{book.author}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      {book.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{book.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      {book.chapters} chapters
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {book.estimatedTime}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={getDifficultyColor(book.difficulty)}>{book.difficulty}</Badge>
                    <div className="flex items-center gap-1 text-accent font-semibold">
                      <span className="text-lg">🪙</span>
                      {book.coins} coins
                    </div>
                  </div>

                  {currentReading === book.id ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 animate-spin" />
                        Reading in progress...
                      </div>
                      <Progress value={66} className="w-full" />
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleStartReading(book.id)}
                      disabled={readingSessions.includes(book.id)}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {readingSessions.includes(book.id) ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed Today
                        </>
                      ) : (
                        "Start Reading"
                      )}
                    </Button>
                  )}
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
