import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, BarChart3, Eye, ArrowRight } from "lucide-react"


export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-b from-accent to-background">
      <div className="container mx-auto px-4 py-12 md:py-24">

        <div className="mb-12 text-center md:mb-16">
          <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1">
            <span className="text-sm font-medium text-primary">Reviews Management Platform</span>
          </div>
          <h1 className="text-balance mb-4 text-4xl font-bold text-foreground sm:text-5xl md:text-6xl">
            Flex Living
            <br />
            <span className="text-primary ">Reviews Manager</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base text-foreground/70 sm:text-lg">
            Manage guest reviews from multiple sources, approve content for display, and showcase your property&apos;s best
            feedback
          </p>
        </div>

        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:gap-8">
          <Card className="group flex flex-col justify-between gap-6 border-2 border-primary/20 p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg sm:p-8">
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-primary/10 p-3 transition-transform group-hover:scale-110">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">Manager Dashboard</h2>
              <p className="text-sm text-foreground/70 sm:text-base">
                Filter, sort, and approve reviews from Hostaway and Google. Control which reviews display publicly on
                your property pages.
              </p>
            </div>
            <Link href="/dashboard" className="w-full">
              <Button size="lg" className="w-full gap-2 bg-primary hover:bg-primary/90">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>

          <Card className="group flex flex-col justify-between gap-6 border-2 border-primary/20 p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg sm:p-8">
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-primary/10 p-3 transition-transform group-hover:scale-110">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">Public Display</h2>
              <p className="text-sm text-foreground/70 sm:text-base">
                View how approved reviews will appear on your property listing details page, matching Flex Living&apos;s
                beautiful design.
              </p>
            </div>
            <Link href="/reviews" className="w-full">
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2 border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
              >
                View Property Reviews
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-card p-6 transition-all hover:shadow-md">
            <Star className="mb-3 h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Multi-Source Integration</h3>
            <p className="mt-2 text-sm text-foreground/70">Hostaway API + Google Reviews exploration</p>
          </div>
          <div className="rounded-lg bg-card p-6 transition-all hover:shadow-md">
            <BarChart3 className="mb-3 h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Review Analytics</h3>
            <p className="mt-2 text-sm text-foreground/70">Category breakdowns and rating trends</p>
          </div>
          <div className="rounded-lg bg-card p-6 transition-all hover:shadow-md">
            <Eye className="mb-3 h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Beautiful Display</h3>
            <p className="mt-2 text-sm text-foreground/70">Matches Flex Living&apos;s design standards</p>
          </div>
        </div>
      </div>
    </main>
  )
}
