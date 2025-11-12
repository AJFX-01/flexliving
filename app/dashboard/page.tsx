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
import { constantUtils } from "@/lib/const"
import { DasboardReviewCard } from "@/components/dashboard-review"

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
     
      <div className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:py-6">
          <div>
            <Link href="/" className="text-lg sm:text-2xl font-bold text-primary">
              Flex Living
            </Link>
            <p className="text-xs sm:text-sm text-foreground/70">Manager Dashboard</p>
          </div>
          <Link href="/reviews" className="hidden sm:block">
            <Button variant="outline" size="sm" className="bg-white rounded-3xl">
              View Public Display
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        
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
                    {Object.entries(constantUtils.statusFilterItems).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterSource} onValueChange={setFilterSource}>
                  <SelectTrigger className="w-full sm:w-40 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(constantUtils.sourceFilterItems).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(constantUtils.ratingFilterItems).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
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
            filteredReviews.map((review, i) => (
              <DasboardReviewCard key={i} review={review} handleApprove={handleApprove} handleReject={handleReject} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
