import { fetchHostawayReviews, normalizeReview } from "@/lib/api"

export async function GET() {
  try {
    const data = await fetchHostawayReviews()

    if (data.result) {
      const normalized = data.result.map((review: HostawayReview) => normalizeReview(review))

      return Response.json({
        success: true,
        data: normalized,
        stats: {
          total: normalized.length,
          approved: normalized.filter((r: NormalizedReview) => r.status === "approved").length,
          pending: normalized.filter((r: NormalizedReview) => r.status === "pending").length,
          averageRating: (normalized.reduce((sum: number, r: ReviewCategory ) => sum + r.rating, 0) / normalized.length).toFixed(1),
        },
      })
    }

    return Response.json(
      {
        success: false,
        error: "Failed to fetch reviews",
      },
      { status: 500 },
    )
  } catch (error) {
    console.error("API error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
