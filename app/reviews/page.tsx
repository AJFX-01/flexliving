"use client"

import { useEffect, useState } from "react"
import { fetchHostawayReviewsFromServer, normalizeReview, fetchGoogleReviews, normalizeGoogleReview } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Wifi, Home, Users } from "lucide-react"
import Link from "next/link"
import { ReviewCard } from "@/components/review-card"


export default function ReviewsPage() {
  const [reviews, setReviews] = useState<NormalizedReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true)
      const hostawayData = await fetchHostawayReviewsFromServer()
      const googleData = await fetchGoogleReviews()

      let allReviews: NormalizedReview[] = []

      if (hostawayData.result) {
        const normalized = hostawayData.result
          .map((review: HostawayReview) => normalizeReview(review))
          .filter((r: NormalizedReview) => r.status === "approved")
        allReviews = [...allReviews, ...normalized]
      }

      if (googleData.result) {
        const normalized = googleData.result.map((review) => normalizeGoogleReview(review))
        allReviews = [...allReviews, ...normalized]
      }

      setReviews(allReviews.slice(0, 6))
      console.log("Loaded combined reviews for display:", allReviews)
      setLoading(false)
    }
    loadReviews()
  }, [])

  const averageRating =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0

  return (
    <div className="min-h-screen bg-background">

      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row">
          <Link href="/" className="text-xl font-bold text-primary sm:text-2xl">
            Flex Living
          </Link>
          <nav className="hidden gap-6 md:flex lg:gap-8">
            <a href="#" className="text-sm text-foreground hover:text-primary sm:text-base">
              Photos
            </a>
            <a href="#" className="text-sm text-foreground hover:text-primary sm:text-base">
              Amenities
            </a>
            <a href="#" className="text-sm font-semibold text-primary sm:text-base">
              Reviews
            </a>
            <a href="#" className="text-sm text-foreground hover:text-primary sm:text-base">
              Location
            </a>
          </nav>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
              Manager
            </Button>
          </Link>
        </div>
      </header>

      <section className="bg-linear-to-b from-accent to-background py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:gap-8 md:grid-cols-2">
            
            <div className="overflow-hidden rounded-lg sm:rounded-xl bg-muted order-2 md:order-1">
              <div className="aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Home className="mx-auto mb-4 h-12 w-12 sm:h-16 sm:w-16 text-foreground/30" />
                  <p className="text-sm sm:text-base text-foreground/50">Beautiful Property Image</p>
                </div>
              </div>
            </div>

            
            <div className="space-y-4 sm:space-y-6 order-1 md:order-2">
              <div>
                <h1 className="text-balance text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                  Stunning 2 Bed Flat near Tower Bridge
                </h1>
                <p className="mt-2 flex items-center gap-2 text-sm sm:text-base text-foreground/70">
                  <MapPin className="h-4 w-4 shrink-0" />
                  London, United Kingdom
                </p>
              </div>

              <Card className="space-y-3 sm:space-y-4 bg-card p-4 sm:p-6">
                <div className="flex items-end gap-3 sm:gap-4">
                  <div className="flex items-baseline gap-1 sm:gap-2">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">{averageRating}</span>
                    <span className="text-base sm:text-lg text-foreground/70">/10</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.round(Number(averageRating)) }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-foreground/70">
                  Based on {reviews.length} verified reviews from Hostaway & Google
                </p>
              </Card>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-muted px-3 sm:px-4 py-2 sm:py-3 transition-all hover:bg-muted/80">
                  <Wifi className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">Free WiFi</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted px-3 sm:px-4 py-2 sm:py-3 transition-all hover:bg-muted/80">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">5 Guests</span>
                </div>
              </div>

              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-sm sm:text-base">
                Reserve Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Guest Reviews</h2>
            <p className="mt-2 text-sm sm:text-base text-foreground/70">What guests are saying about this property</p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-foreground/50">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <Card className="p-8 sm:p-12 text-center">
              <p className="text-foreground/70">No reviews yet. Check back soon!</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </section>

     
      <section className="bg-primary/5 py-8 sm:py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">Ready to book your stay?</h3>
          <p className="mt-2 text-sm sm:text-base text-foreground/70">Join thousands of happy guests at Flex Living</p>
          <Button size="lg" className="mt-4 sm:mt-6 bg-primary hover:bg-primary/90 text-sm sm:text-base">
            Check Availability
          </Button>
        </div>
      </section>

      
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-6 sm:py-8 text-center text-xs sm:text-sm text-foreground/70">
          <p>&copy; 2025 Flex Living. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
