"use client"

import { useEffect, useMemo, useState } from "react"
import { fetchHostawayReviewsFromServer, normalizeReview, fetchGoogleReviews, normalizeGoogleReview } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, XCircle, Star, Search, Globe } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [reviews, setReviews] = useState<NormalizedReview[]>([])
  // const [filteredReviews, setFilteredReviews] = useState<NormalizedReview[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSource, setFilterSource] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    const loadReviews = async () => {
      const hostawayData = await fetchHostawayReviewsFromServer()
      const googleData = await fetchGoogleReviews()

      let allReviews: NormalizedReview[] = []

      if (hostawayData.result) {
        const normalized = hostawayData.result.map((review: HostawayReview) => normalizeReview(review))
        allReviews = [...allReviews, ...normalized]
      }

      if (googleData.result) {
        const normalized = googleData.result.map((review: GoogleReview) => normalizeGoogleReview(review))
        allReviews = [...allReviews, ...normalized]
      }

      setReviews(allReviews)
      console.log("Loaded combined reviews:", allReviews)
      setLoading(false)
    }
    loadReviews()
  }, [])

  // useEffect(() => {
  //   let filtered = reviews

  //   if (filterStatus !== "all") {
  //     filtered = filtered.filter((r) => r.status === filterStatus)
  //   }

  //   if (filterSource !== "all") {
  //     filtered = filtered.filter((r) => r.source === filterSource)
  //   }

  //   if (searchTerm) {
  //     filtered = filtered.filter(
  //       (r) =>
  //         r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         r.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         r.text.toLowerCase().includes(searchTerm.toLowerCase()),
  //     )
  //   }

  //   if (sortBy === "newest") {
  //     filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
  //   } else if (sortBy === "highest-rating") {
  //     filtered.sort((a, b) => b.rating - a.rating)
  //   } else if (sortBy === "lowest-rating") {
  //     filtered.sort((a, b) => a.rating - b.rating)
  //   }

  //   setFilteredReviews(filtered)
  // }, [reviews, searchTerm, filterStatus, filterSource, sortBy])
  const filteredReviews = useMemo(() => {
    let filtered = reviews

    if (filterStatus !== "all") {
      filtered = filtered.filter((r) => r.status === filterStatus)
    }

    if (filterSource !== "all") {
      filtered = filtered.filter((r) => r.source === filterSource)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.text.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    } else if (sortBy === "highest-rating") {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "lowest-rating") {
      filtered.sort((a, b) => a.rating - b.rating)
    }

    return filtered
  }, [reviews, searchTerm, filterStatus, filterSource, sortBy])


  const handleApprove = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: "approved" } : r)))
  }

  const handleReject = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)))
  }

  const stats = {
    total: reviews.length,
    hostaway: reviews.filter((r) => r.source === "hostaway").length,
    google: reviews.filter((r) => r.source === "google").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    pending: reviews.filter((r) => r.status === "pending").length,
    averageRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mobile Optimized */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:py-6">
          <div>
            <Link href="/" className="text-lg sm:text-2xl font-bold text-primary">
              Flex Living
            </Link>
            <p className="text-xs sm:text-sm text-foreground/70">Manager Dashboard</p>
          </div>
          <Link href="/reviews" className="hidden sm:block">
            <Button variant="outline" size="sm">
              View Public Display
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Stats Cards - Responsive Grid */}
        <div className="mb-8 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="p-4 sm:p-6">
            <div className="text-xs sm:text-sm font-medium text-foreground/70">Total Reviews</div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-primary">{stats.total}</div>
          </Card>
          <Card className="p-4 sm:p-6">
            <div className="text-xs sm:text-sm font-medium text-foreground/70">Hostaway</div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-blue-600">{stats.hostaway}</div>
          </Card>
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs sm:text-sm font-medium text-foreground/70">Google</div>
                <div className="mt-2 text-2xl sm:text-3xl font-bold text-red-600">{stats.google}</div>
              </div>
              <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
          </Card>
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs sm:text-sm font-medium text-foreground/70">Approved</div>
                <div className="mt-2 text-2xl sm:text-3xl font-bold text-green-600">{stats.approved}</div>
              </div>
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
          </Card>
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs sm:text-sm font-medium text-foreground/70">Avg Rating</div>
                <div className="mt-2 text-2xl sm:text-3xl font-bold text-primary">{stats.averageRating}</div>
              </div>
              <Star className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
          </Card>
        </div>

        {/* Filters and Search - Responsive */}
        <Card className="mb-6 p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-foreground/50 shrink-0" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 text-sm"
              />
            </div>
            <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterSource} onValueChange={setFilterSource}>
                  <SelectTrigger className="w-full sm:w-40 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="hostaway">Hostaway</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="highest-rating">Highest Rating</SelectItem>
                  <SelectItem value="lowest-rating">Lowest Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Reviews List */}
        <div className="space-y-3 sm:space-y-4">
          {loading ? (
            <div className="py-12 text-center text-foreground/50">Loading reviews...</div>
          ) : filteredReviews.length === 0 ? (
            <div className="py-12 text-center text-foreground/50">No reviews found</div>
          ) : (
            filteredReviews.map((review) => (
              <Card key={review.id} className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base">{review.guestName}</h3>
                        <Badge
                          variant={
                            review.status === "approved"
                              ? "default"
                              : review.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {review.status}
                        </Badge>
                        <Badge variant="outline" className="capitalize text-xs">
                          {review.source === "google" ? (
                            <>
                              <Globe className="mr-1 h-2.5 w-2.5" />
                              Google
                            </>
                          ) : (
                            "Hostaway"
                          )}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-foreground/70 mt-1">{review.propertyName}</p>
                      <p className="text-xs sm:text-sm text-foreground/70">
                        {new Date(review.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>

                  <p className="text-foreground text-sm">{review.text}</p>

                  {Object.entries(review.categories).length > 0 && (
                    <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                      {Object.entries(review.categories).map(([category, rating]: [string, number]) => (
                        <div
                          key={category}
                          className="flex items-center justify-between rounded-md bg-muted p-2 sm:p-3"
                        >
                          <span className="text-xs sm:text-sm font-medium text-muted-foreground capitalize">
                            {category.replace(/_/g, " ")}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-primary">{rating}/10</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 pt-2">
                    {review.status !== "approved" && (
                      <Button
                        size="sm"
                        onClick={() => handleApprove(review.id)}
                        className="gap-2 text-xs sm:text-sm w-full sm:w-auto"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </Button>
                    )}
                    {review.status !== "rejected" && review.source === "hostaway" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(review.id)}
                        className="gap-2 text-xs sm:text-sm w-full sm:w-auto"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    )}
                    {review.source === "google" && review.status === "approved" && (
                      <Badge variant="secondary" className="text-xs w-full sm:w-auto justify-center">
                        Synced from Google
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
