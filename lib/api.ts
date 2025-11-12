
export async function fetchHostawayReviewsFromServer() {
  try {
    const response = await fetch("/api/reviews/hostaway/fetch")
    return response.json()
  } catch (error) {
    console.error("Error fetching Hostaway reviews:", error)
    return { status: "error", result: [] }
  }
}

export const fetchHostawayReviews = fetchHostawayReviewsFromServer

export function normalizeReview(review: HostawayReview,): NormalizedReview {
  const avgRating =
    review.reviewCategory?.length > 0
      ? Math.round(
          review.reviewCategory.reduce((sum: number, cat: ReviewCategory) => sum + cat.rating, 0) / review.reviewCategory.length,
        )
      : review.rating || 0

  const categories: { [key: string]: number } = {}
  review.reviewCategory?.forEach((cat: ReviewCategory) => {
    categories[cat.category] = cat.rating
  })

  return {
    id: `hostaway-${review.id}`,
    source: "hostaway",
    propertyName: review.listingName,
    guestName: review.guestName,
    rating: avgRating,
    text: review.publicReview,
    submittedAt: review.submittedAt,
    categories,
    status: review.status === "published" ? "approved" : review.status === "draft" ? "pending" : "rejected",
    type: review.type,
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchGoogleReviews(placeId?: string) {
  try {
    const mockGoogleData: GoogleResponse  = {
      status: "success",
      result: [
        {
          id: "google-review-1",
          author: "James Thompson",
          rating: 10,
          text: "Fantastic location and beautiful apartment. The host was very responsive to all queries. Highly recommend!",
          time: Date.now() - 7 * 24 * 60 * 60 * 1000,
          source: "google",
        },
        {
          id: "google-review-2",
          author: "Lisa Rodriguez",
          rating: 8,
          text: "Great flat in a perfect location. Very clean and well-maintained. Minor issue with heating but quickly resolved.",
          time: Date.now() - 14 * 24 * 60 * 60 * 1000,
          source: "google",
        },
        {
          id: "google-review-3",
          author: "Ahmed Hassan",
          rating: 9,
          text: "Excellent stay. All amenities working perfectly. Close to everything - restaurants, bars, and transport.",
          time: Date.now() - 30 * 24 * 60 * 60 * 1000,
          source: "google",
        },
      ],
    }

    return mockGoogleData
  } catch (error) {
    console.error("Error fetching Google reviews:", error)
    return { status: "error", result: [] }
  }
}

export function normalizeGoogleReview(review: GoogleReview): NormalizedReview {
  return {
    id: review.id,
    source: "google",
    propertyName: "Property Review",
    guestName: review.author,
    rating: review.rating,
    text: review.text,
    submittedAt: new Date(review.time).toISOString(),
    categories: {},
    status: "approved",
    type: "public",
  }
}
