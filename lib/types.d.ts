declare global {

  interface ReviewCategory {
    category: "cleanliness" | "communication" | "respect_house_rules" | "accuracy" | "checkin" | "value"
    rating: number
  }

  interface HostawayReview {
    id: string
    type: "host-to-guest" | "guest-to-host"
    status: "published" | "archived" | "draft" | "approved" 
    rating: number | null
    publicReview: string
    reviewCategory: ReviewCategory[]
    submittedAt: string
    guestName: string
    listingName: string
  }

  interface NormalizedReview {
    id: string
    source: "hostaway" | "google"
    propertyName: string
    guestName: string
    rating: number
    text: string
    submittedAt: string
    categories: {
      [key: string]: number
    }
    status: "approved" | "pending" | "rejected"
    type: "host-to-guest" | "guest-to-host" | "public"
  }

  interface ReviewStats {
    totalReviews: number
    averageRating: number
    approvedCount: number
    pendingCount: number
    categoryBreakdown: {
      [key: string]: number
    }
    sourceBreakdown: {
      hostaway: number
      google: number
    }
  }

  interface GoogleReview {
    id: string
    author: string
    rating: number
    text: string
    time: number
    source: "google"
  }

  interface ReviewCardProps {
    review: {
      id: string
      guestName: string
      rating: number
      text: string
      submittedAt: string
      source?: "hostaway" | "google"
      categories?: { [key: string]: number }
    }
  }

  interface GoogleResponse {
    status: string
    result: GoogleReview[]
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {}