
"use client"
import { Badge } from "@/components/ui/badge"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { CheckCircle2, Globe, Star, XCircle } from "lucide-react"

export const DasboardReviewCard = ({review, handleApprove, handleReject}: {review: NormalizedReview, handleApprove: (id: string) => void, handleReject: (id: string) => void  }) => {

  return (
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
  )
}