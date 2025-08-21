"use client"

import { useState } from "react"
import { Building2, Users, Target, TrendingUp, Award, CheckCircle, ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppState } from "@/hooks/use-app-state"

export default function CorporatePage() {
  const { addCoins } = useAppState()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [partnerships, setPartnerships] = useState([
    { id: 1, company: "TechCorp", employees: 500, impact: "2,500 volunteer hours", status: "Active" },
    { id: 2, company: "GreenEnergy Inc", employees: 200, impact: "1,200 trees planted", status: "Active" },
    { id: 3, company: "HealthPlus", employees: 300, impact: "$50,000 donated", status: "Pending" },
  ])

  const plans = [
    {
      name: "Starter",
      price: "$99/month",
      employees: "Up to 50",
      features: [
        "Basic CSR dashboard",
        "Employee engagement tracking",
        "Monthly impact reports",
        "Community challenges",
      ],
      popular: false,
    },
    {
      name: "Growth",
      price: "$299/month",
      employees: "Up to 200",
      features: [
        "Advanced analytics",
        "Custom volunteer programs",
        "Branded campaigns",
        "Quarterly strategy sessions",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      employees: "Unlimited",
      features: [
        "Full white-label solution",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced reporting",
        "24/7 support",
      ],
      popular: false,
    },
  ]

  const handlePartnership = (planName: string) => {
    setSelectedPlan(planName)
    addCoins(100)
    // Simulate partnership creation
    setTimeout(() => {
      setSelectedPlan(null)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 pb-20">
      {/* Header */}
      <div className="bg-primary/5 border-b border-primary/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Corporate Partnerships</h1>
              <p className="text-muted-foreground">Amplify your company's social impact</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Impact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-muted-foreground">Partner Companies</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Target className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">25K</div>
              <div className="text-sm text-muted-foreground">Employees Engaged</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold">$2M</div>
              <div className="text-sm text-muted-foreground">Impact Generated</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Award className="w-8 h-8 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold">95%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Partnership Plans */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Partnership Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? "ring-2 ring-primary" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">Most Popular</Badge>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    {plan.popular && <Star className="w-5 h-5 text-primary" />}
                  </CardTitle>
                  <CardDescription>{plan.employees}</CardDescription>
                  <div className="text-3xl font-bold text-primary">{plan.price}</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handlePartnership(plan.name)}
                    disabled={selectedPlan === plan.name}
                  >
                    {selectedPlan === plan.name ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <>
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Partnerships */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Current Partnerships</h2>
          <div className="space-y-4">
            {partnerships.map((partnership) => (
              <Card key={partnership.id} className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{partnership.company}</h3>
                      <p className="text-sm text-muted-foreground">{partnership.employees} employees</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{partnership.impact}</div>
                    <Badge variant={partnership.status === "Active" ? "default" : "secondary"}>
                      {partnership.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle>Why Partner With Impact Rewards?</CardTitle>
            <CardDescription>Transform your corporate social responsibility program</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success mt-1" />
                <div>
                  <h4 className="font-medium">Boost Employee Engagement</h4>
                  <p className="text-sm text-muted-foreground">
                    Gamified social impact activities increase participation by 300%
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success mt-1" />
                <div>
                  <h4 className="font-medium">Measurable Impact</h4>
                  <p className="text-sm text-muted-foreground">
                    Real-time analytics and comprehensive impact reporting
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success mt-1" />
                <div>
                  <h4 className="font-medium">Brand Enhancement</h4>
                  <p className="text-sm text-muted-foreground">
                    Strengthen your company's reputation and social responsibility
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success mt-1" />
                <div>
                  <h4 className="font-medium">Easy Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Seamless setup with existing HR and communication systems
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
