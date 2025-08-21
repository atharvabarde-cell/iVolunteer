"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Heart, DollarSign, BookOpen, Gift, Building2 } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/volunteer", icon: Heart, label: "Volunteer" },
    { href: "/donate", icon: DollarSign, label: "Donate" },
    { href: "/read", icon: BookOpen, label: "Read" },
    { href: "/rewards", icon: Gift, label: "Rewards" },
    { href: "/corporate", icon: Building2, label: "Corporate" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
