"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import { DailyQuote } from "@/components/daily-quote"
import { Heart, DollarSign, Users, Sparkles, TrendingUp, Star, Trophy, Award, Flame } from "lucide-react"
import { useAppState } from "@/hooks/use-app-state"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import cleanupImg from "./components/images/cleanup.jpg" 

export default function HomePage() {
  const { user } = useAuth()
  const { checkDailyReset, userCoins, badges, streakCount } = useAppState()

  useEffect(() => {
    if (user && user.role === "user") checkDailyReset()
  }, [checkDailyReset, user])

  const activities = [
    { id: "volunteer", title: "Volunteer", description: "Find local NGOs and volunteer opportunities", icon: Heart, color: "bg-gradient-to-br from-rose-500 to-pink-600", coins: 50 },
    { id: "donate", title: "Donate", description: "Make a donation and earn rewards", icon: DollarSign, color: "bg-gradient-to-br from-emerald-500 to-teal-600", coins: 75 },
    { id: "community", title: "Community Events", description: "Join local community activities", icon: Users, color: "bg-gradient-to-br from-blue-500 to-indigo-600", coins: 40 },
  ]

  const achievements = [
    { icon: Trophy, label: "Top Contributor", color: "text-yellow-500", bgColor: "from-yellow-100 to-yellow-200" },
    { icon: Flame, label: `${streakCount} Day Streak`, color: "text-orange-500", bgColor: "from-orange-100 to-orange-200" },
    { icon: Star, label: "Community Leader", color: "text-blue-500", bgColor: "from-blue-100 to-blue-200" },
    { icon: Award, label: "Impact Pioneer", color: "text-emerald-500", bgColor: "from-emerald-100 to-emerald-200" },
  ]

  const featuredStories = [
    { title: "Local NGO Clean-Up Drive", description: "Over 100 volunteers gathered to clean the local park and riverbanks.", image: "/components/images/cleanup.jpg", coins: 120 },
    { title: "School Supplies Donation", description: "Provided 500 students with essential school supplies in remote areas.", image: "/images/donation.jpg", coins: 80 },
  ]

  const tips = [
    "Consistency is key: earn streak rewards every day!",
    "Engage in community events to unlock rare badges.",
    "Invite friends to participate and earn bonus coins.",
  ]

  const whatWeDo = [
    { title: "Empower Communities", description: "Support and uplift communities through volunteer initiatives.", icon: Users },
    { title: "Promote Education", description: "Provide resources, mentorship, and guidance to learners.", icon: Star },
    { title: "Support Environment", description: "Participate in clean-up drives and sustainability projects.", icon: Heart },
  ]

  const aboutText = `Our platform connects volunteers, donors, and community leaders to create a positive social impact. 
  Join us to make a real difference and track your contributions through achievements, badges, and coins.`

  if (user && user.role !== "user") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30">
        <Header />
        <main className="px-6 pb-24 max-w-md mx-auto text-center mt-12">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl mb-8 animate-pulse">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 font-serif">Welcome, {user.name}</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Your dashboard is ready. Use the navigation below to manage your events.
          </p>
        </main>
        <Navigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 relative overflow-hidden">
      <Header />

      <main className="relative px-6 pb-24 max-w-5xl mx-auto">
        {/* Welcome */}
        <section className="mt-12 mb-16 text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 via-emerald-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl mb-8 animate-pulse hover:scale-110 transition-transform duration-500">
            <Sparkles className="w-10 h-10 text-white animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 font-serif">Welcome Back</h1>
          <p className="text-slate-600 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Continue your journey of impact and community building
          </p>
        </section>

        {/* Streak / Stats Row */}
        <section className="flex justify-around items-center gap-8 mb-12 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white animate-spin" />
            </div>
            <span className="mt-2 font-black text-xl text-slate-900">{userCoins}</span>
            <span className="text-slate-600 text-sm uppercase tracking-wide">Coins</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <Flame className="w-7 h-7 text-white animate-pulse" />
            </div>
            <span className="mt-2 font-black text-xl text-slate-900">{streakCount}</span>
            <span className="text-slate-600 text-sm uppercase tracking-wide">Day Streak</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-7 h-7 text-white animate-pulse" />
            </div>
            <span className="mt-2 font-black text-xl text-slate-900">{badges.length}</span>
            <span className="text-slate-600 text-sm uppercase tracking-wide">Badges</span>
          </div>
        </section>

        {/* Daily Quote */}
        <section className="mb-16 text-center">
          <DailyQuote />
        </section>

        {/* Activities */}
        <section className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-8 text-center font-serif">Ways to Make Impact</h2>
          <div className="flex flex-col md:flex-row gap-6">
            {activities.map(activity => (
              <div key={activity.id} className={`flex-1 flex items-center p-6 rounded-3xl shadow-lg ${activity.color} text-white hover:scale-105 transition-transform duration-500`}>
                <activity.icon className="w-10 h-10 mr-4" />
                <div>
                  <h3 className="text-xl font-bold">{activity.title}</h3>
                  <p className="text-sm">{activity.description}</p>
                  <Badge className="mt-2 bg-white text-black font-bold">+{activity.coins} coins</Badge>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What We Do */}
        <section className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-8 text-center font-serif">What We Do</h2>
          <div className="flex flex-col md:flex-row gap-6">
            {whatWeDo.map((item, idx) => (
              <div key={idx} className="flex-1 p-6 rounded-3xl bg-gradient-to-br from-white/50 via-blue-50/30 to-emerald-50/30 shadow-lg text-center">
                <item.icon className="w-10 h-10 mx-auto mb-4 text-blue-500 animate-bounce" />
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Stories */}
        <section className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-8 text-center font-serif">Featured Stories</h2>
          <div className="flex flex-col md:flex-row gap-6">
            {featuredStories.map((story, idx) => (
              <div key={idx} className="flex-1 relative rounded-3xl overflow-hidden shadow-lg group">
                <img src={story.image} alt={story.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold">{story.title}</h3>
                  <p className="text-sm">{story.description}</p>
                  <Badge className="mt-2 bg-emerald-500">+{story.coins} coins</Badge>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-8 font-serif">Pro Tips</h2>
          <div className="flex flex-col md:flex-row gap-6">
            {tips.map((tip, idx) => (
              <div key={idx} className="flex-1 p-6 rounded-3xl bg-gradient-to-br from-white/50 via-blue-50/30 to-emerald-50/30 shadow-lg">
                <p className="text-slate-700 text-lg">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-slate-900 mb-6 font-serif">About Us</h2>
          <p className="text-slate-700 text-lg leading-relaxed">{aboutText}</p>
        </section>

        {/* Motivational Banner */}
        <section className="mb-16 text-center p-12 rounded-3xl bg-gradient-to-br from-blue-500 via-emerald-500 to-indigo-500 text-white shadow-2xl">
          <Sparkles className="w-12 h-12 mx-auto mb-4 animate-spin" />
          <h3 className="text-4xl font-black mb-4 font-serif">Keep Making Impact</h3>
          <p className="text-lg max-w-2xl mx-auto mb-6">
            Every action counts towards building a better world. Continue your journey of positive change.
          </p>
          <Badge className="bg-white text-blue-600 font-bold px-8 py-3 text-lg">You're making a difference! ✨</Badge>
        </section>
      </main>

      <Navigation />
    </div>
  )
}
