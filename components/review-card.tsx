import { Card } from "@/components/ui/card"
import { Star, Globe } from "lucide-react"


export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="flex flex-col gap-4 p-6 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
          ))}
          <span className="text-sm font-medium text-primary">{review.rating}/10</span>
        </div>
        {review.source === "google" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
            <Globe className="h-3 w-3" />
            Google
          </span>
        )}
      </div>

      <p className="text-foreground line-clamp-3">{review.text}</p>

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

      <div className="border-t border-border pt-4">
        <p className="font-semibold text-foreground">{review.guestName}</p>
        <p className="text-xs text-foreground/50">
          {new Date(review.submittedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
    </Card>
  )
}
