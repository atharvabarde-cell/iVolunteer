"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Coins } from "lucide-react"
import { useAppState } from "@/hooks/use-app-state"

const quotes = [
  {
    text: "The best way to find yourself is to lose yourself in the service of others.",
    author: "Mahatma Gandhi",
  },
  {
    text: "No one has ever become poor by giving.",
    author: "Anne Frank",
  },
  {
    text: "We make a living by what we get, but we make a life by what we give.",
    author: "Winston Churchill",
  },
]

export function DailyQuote() {
  const { dailyQuoteClaimed, claimDailyQuote, streakCount } = useAppState()
  const [showSparkle, setShowSparkle] = useState(false)
  const [showCoinAnimation, setShowCoinAnimation] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(quotes[0])

  useEffect(() => {
    const today = new Date()
    const quoteIndex = today.getDate() % quotes.length
    setCurrentQuote(quotes[quoteIndex])

    if (!dailyQuoteClaimed) {
      setShowSparkle(true)
    }
  }, [dailyQuoteClaimed])

  const handleClaimReward = () => {
    if (!dailyQuoteClaimed) {
      setShowCoinAnimation(true)
      claimDailyQuote()
      setShowSparkle(false)

      // Reset animation after it completes
      setTimeout(() => setShowCoinAnimation(false), 800)
    }
  }

  return (
    <Card
      className={`p-4 mt-4 relative overflow-hidden transition-all duration-300 hover:shadow-md ${showSparkle ? "animate-sparkle" : ""}`}
    >
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Sparkles className="w-6 h-6 text-accent" />
          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">
            {streakCount} day streak
          </span>
        </div>

        <blockquote className="text-sm text-muted-foreground italic mb-2">"{currentQuote.text}"</blockquote>
        <p className="text-xs text-muted-foreground mb-3">— {currentQuote.author}</p>

        <Button
          onClick={handleClaimReward}
          disabled={dailyQuoteClaimed}
          size="sm"
          className="relative transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
        >
          <Coins className="w-4 h-4 mr-1" />
          {dailyQuoteClaimed ? "Claimed Today ✓" : "Claim 10 Coins"}
        </Button>
      </div>

      {showCoinAnimation && (
        <>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <Coins className="w-6 h-6 text-accent animate-coin-fly" />
          </div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ animationDelay: "0.1s" }}
          >
            <Coins className="w-4 h-4 text-accent animate-coin-fly" />
          </div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ animationDelay: "0.2s" }}
          >
            <Coins className="w-5 h-5 text-accent animate-coin-fly" />
          </div>
        </>
      )}
    </Card>
  )
}
