import { Star, Globe } from "lucide-react"
import { ReviewText } from "./review-text"


export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="flex flex-col gap-2  transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-primary text-primary" />
          ))}
          <span className="text-[17px] font-medium text-primary/80"> · {review.guestName} ·  {new Date(review.submittedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })}</span>
        </div>
        {review.source === "google" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
            <Globe className="h-3 w-3" />
            Google
          </span>
        )}
      </div>

      {/* <p className="text-foreground line-clamp-3">{review.text}</p> */}
      <ReviewText text={review.text} />

      {review.categories && Object.entries(review.categories).length > 0 && (
        <div className="space-y-2">
          {Object.entries(review.categories)
            .slice(0, 3)
            .map(([category, rating]: [string, number]) => (
              <div key={category} className="flex items-center justify-between text-sm">
                <span className="text-foreground/70 capitalize">{category.replace(/_/g, " ")}</span>
                <div className="flex gap-1">
                  {Array.from({ length: Math.round(rating / 2) }).map((_, i) => (
                    <div key={i} className="h-1.5 w-1.5 rounded-full bg-primary" />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}


