"use client"

import { useEffect, useState } from "react"
import { fetchHostawayReviewsFromServer, normalizeReview, fetchGoogleReviews, normalizeGoogleReview } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Wifi, Hotel, PaintBucket, ForkKnife, BathIcon, Calendar, Users } from "lucide-react"
import Link from "next/link"
import { ReviewCard } from "@/components/review-card"
import Image from "next/image"



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
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2) : 0

  return (
    <div className="min-h-screen bg-white">

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

      <section className="py-4 sm:py-8 md:py-4">
        <div className="container mx-auto px-8">
          <div className="grid gap-2 md:gap-2 md:grid-cols-2">
            
            <div className="overflow-hidden rounded-3xl sm:rounded-xl bg-muted order-2 md:order-1">
              <Image 
                src={'https://bookingenginecdn.hostaway.com/listing/23248-79029-1DNvDYRdLXEs8zYkdv5-C--soHnVysh8PYgkf0eatwJM-68e64bf937084?width=1280&quality=70&format=webp&v=2'} 
                alt={""} 
                unoptimized={true} 
                className="object-cover w-full h-full rounded-3xl"
                width={100}
                height={500}
              />
            </div>

            <div className="space-y-2 sm:space-y-6 order-1 md:order-2">
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3 px-2">
                {imageURLs.map((imageURL, index) => (
                  <Image
                  key={index}
                  src={imageURL || ''} 
                  alt={""} 
                  unoptimized={true} 
                  className="w-full h-[200px] rounded-3xl"
                  width={100}
                  height={100}
                />))}
              </div>
              {/* <div>
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
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      
      <section className="sm:py-16 relative">
        <div className="w-1/2 p-0 m-0">
          <div className="container mx-auto px-8">
            <div className="mb-5 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary">Beautiful Pimlico Flat near Victoria Station - The Flex London</h2>
              <p className="mt-2 text-sm sm:text-base text-foreground/70">Apartment · 4 guests · 1 bedroom · 1 bathroom</p>
              <span className="flex flex-row items-center mt-4 font-bold text-primary" ><Star className="h-5 w-5 fill-amber-400 text-amber-400 mr-1 " />  {averageRating}  ·  <span className="text-primar underline font-bold ml-2">  ({reviews.length}) reviews</span> </span>
              <p className="my-5 text-ellipsis text-sm sm:text-base text-foreground/80">This spacious apartment in Pimlico is ideal for anyone looking for comfort and convenience. It’s just a short walk from everything you need – restaurants, shops, and public transport. The apartment has great quality amenities, making it a perfect home away from home. I’ve made sure it’s a welcoming,...</p>
              <Button className="px-6 py-6 bg-background hover:bg-background cursor-pointer text-primary border rounded-3xl text-sm sm:text-base">
                Show more
              </Button> 
            </div>
            <div className="h-px w-full bg-border mb-8" />
              
            <div>
              <h2 className="text-xl sm:text-xl font-bold text-primary mb-5">Amenities</h2> 
              <div className="grid grid-cols-2 md:grid-cols-2 gap-6 px-2">
                {amenitiesItem?.map((item, i) => (
                  <div key={i} className="flex flex-row gap-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
              <Button className="py-6 px-6 bg-background hover:bg-background cursor-pointer text-primary border rounded-3xl text-sm sm:text-base mt-5">
                Show all 47 amenities
              </Button> 
            </div>
            
            <div className="h-px w-full bg-border my-8" />

            <div>
              <h2 className="text-xl sm:text-xl font-bold text-primary mb-5">Available days</h2> 
              <div className="grid grid-cols-2 md:grid-cols-2 gap-6 px-2">
                {amenitiesItem?.map((item, i) => (
                  <div key={i} className="flex flex-row gap-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
              <Button className="py-6 px-6 bg-background hover:bg-background cursor-pointer text-primary border rounded-3xl text-sm sm:text-base mt-5">
                Show all 47 amenities
              </Button> 
            </div>

            <div className="h-px w-full bg-border my-8" />
            <span className="flex flex-row text-primary items-center mt-4 font-bold text-xl mb-5" ><span className="text-primary text-xl font-bold mr-3"> Reviews</span> <Star className="h-6 w-6 fill-amber-400 text-amber-400 mr-1 " />  {averageRating}  ({reviews.length})  </span>
            {loading ? (
              <div className="py-12 text-center text-foreground/50">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <Card className="p-8 sm:p-12 text-center">
                <p className="text-foreground/70">No reviews yet. Check back soon!</p>
              </Card>
            ) : (
              <div className="grid gap-4 sm:gap-6 md:grid-cols-1 lg:grid-cols-1">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
            <Button className="py-6 px-6 bg-background hover:bg-background cursor-pointer text-primary border rounded-3xl text-sm sm:text-base mt-5">
              Show all {reviews.length} reviews
            </Button> 
            <div className="h-px w-full bg-border my-8" />
            <span className="flex flex-row text-primary items-center mt-4 font-bold text-xl mb-5">Good to know</span>
            <div>
              <span className=" text-primary font-semibold mb-4">House Rules</span>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3 my-5">
                {rules.map((item, i) => (
                  <span key={i} className="">{item}</span>
                ))}
              </div>
              <Button className="px-4 py-4 bg-background hover:bg-background cursor-pointer text-primary border rounded-3xl text-sm sm:text-base">
                Show more
              </Button>
            </div>
            <p className=" text-primary font-semibold mt-6 mb-4">Cancellation policy</p>
            <span className="">100% refund up to 14 days before arrival</span>
          </div>
        </div>
        <Card className="bg-white flex flex-col gap-4 p-6 transition-all absolute top-0 right-8 w-[35%]">
          <span className="text-center text-[12px] font-medium text-primary">Select dates and number of guests to see the total price per night</span>
          <div className="flex items-center justify-between mb-4">
            <Button className="w-[47%] justify-start py-6 bg-white hover:bg-white cursor-pointer text-primary/35 border rounded-3xl text-sm sm:text-base mt-5">
              <Calendar className="text-primary/70 mr-3" /> Select Dates
            </Button> 
            <Button className="w-[47%] justify-start py-6 bg-white hover:bg-white cursor-pointer text-start text-primary/35 border rounded-3xl text-sm sm:text-base mt-5">
              <Users className="text-primary/70 mr-3" />  1
            </Button> 
          </div>
          <Button className="w-full py-6 bg-white hover:bg-white cursor-pointer text-primary border rounded-3xl text-sm sm:text-base mt-5">
            Send Inquiry
          </Button> 
        </Card>
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


const imageURLs = [
  "https://bookingenginecdn.hostaway.com/listing/23248-79029-SfTV9--CrlCv9---rP7uE5bSGCBJDCLTyaNLhH1NZ1B5k-68e64c0550cf3?width=1280&quality=70&format=webp&v=2",,
  "https://bookingenginecdn.hostaway.com/listing/23248-79029-SfTV9--CrlCv9---rP7uE5bSGCBJDCLTyaNLhH1NZ1B5k-68e64c0550cf3?width=1280&quality=70&format=webp&v=2",
  "https://bookingenginecdn.hostaway.com/listing/23248-79029-SfTV9--CrlCv9---rP7uE5bSGCBJDCLTyaNLhH1NZ1B5k-68e64c0550cf3?width=1280&quality=70&format=webp&v=2",
  "https://bookingenginecdn.hostaway.com/listing/23248-79029-SfTV9--CrlCv9---rP7uE5bSGCBJDCLTyaNLhH1NZ1B5k-68e64c0550cf3?width=1280&quality=70&format=webp&v=2",
]

const amenitiesItem: {title: string; icon: React.JSX.Element}[] = [
  {
    title: 'Free WiFi',
    icon: <Wifi />
  },
  {
    title: 'Internet',
    icon: <Wifi />
  },
  {
    title: 'Private living room',
    icon: <Hotel />
  },
    {
    title: 'Essentials',
    icon: <PaintBucket />
  },
    {
    title: 'Towels',
    icon: <BathIcon />
  },
    {
    title: 'Kitchen',
    icon: <ForkKnife />
  }
]

const rules: string[] = ["Check-in: 3 pm", "Pets: not allowed", "Check-out: 10 am", "Smoking inside: not allowed" ]