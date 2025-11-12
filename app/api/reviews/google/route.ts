import { fetchGoogleReviews, normalizeGoogleReview } from "@/lib/api"

export async function GET() {
  try {
    const data = await fetchGoogleReviews()

    if (data.result) {
      const normalized = data.result.map((review) => normalizeGoogleReview(review))

      return Response.json({
        success: true,
        data: normalized,
        stats: {
          total: normalized.length,
          averageRating: (normalized.reduce((sum, r) => sum + r.rating, 0) / normalized.length).toFixed(1),
        },
      })
    }

    return Response.json(
      {
        success: false,
        error: "Failed to fetch Google reviews",
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
