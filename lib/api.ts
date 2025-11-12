
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
    rating: avgRating / 2,
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
          text: "Pobyt bardzo udany, zaspokojone oczekiwania, bardzo miłe wspomnienia. Positive: Świetna lokalizacja, blisko do ciekawych obiektów a jak brak sił to metro po drugiej stronie ulicy autobus za rogiem. Sklep kawałek dalej. Cicha okolica. Lokal spełniał moje potrzeby za kwotę jaką przeznaczyłem do wydania. Zmywarka ,pralka i inne urządzenia przewyższały moje potrzeby. A zapewnione produkty do pralki czy zmywarki zaskoczyły mnie w stosunku do innych obiektów gdzie była jedna sztuka lub wcale. Negative: Obiekt w ofercie przedstawia obrazy komputerowe, wygładzone jak by z foto-szop. W rzeczywistości wygląda podobnie ale ja nie mogąc skontaktować się z wynajmującym przez pewien czas nabrałem wątpliwości czy jest to prawdziwy apartament. Wynająłem obiekt na 3 osoby a przygotowane było tylko łóżko dwuosobowe. Jak się później okazało trzecim posłaniem był wysoki materac pneumatyczny z automatyczną pompką który trzeba było samemu znaleźć w schowku , podłączyć do prądu, pościelić. My z racji zmęczenia po trudach podróży i zwiedzania zrobiliśmy to dopiero następnego dnia. Nigdy nie spotkałem się z taką formą wynajmując obiekt z odpowiednim wyprzedzeniem czasowym. Kończąc wynajem trzeba zrobić koniecznie fotkę skrzyneczki z kluczami, że się opuściło obiekt do godziny 10 tej lub kara 300 funtów pobierana z kaucji. Może w Londynie jest to norma? Byłem pierwszy raz jeszcze wrócę ogólnie było super",
          time: Date.now() - 7 * 24 * 60 * 60 * 1000,
          source: "google",
        },
        {
          id: "google-review-2",
          author: "Lisa Rodriguez",
          rating: 8,
          text: "Great flat in a perfect location. Very clean and well-maintained. Minor issue with heating but quickly resolved.Positive: Location is central London and next to the subway. Easy to recover the keys from a lock box in the nearby street. Everything listed in the apartment is present. Negative: Unfortunately, the pictures on the website versus the reality made the experience very strange. We did not pay enough attention to the pictures from our small phone display. All pictures are 3D and the apartment is not really what we expected. So once we arrived we were really disappointed by the reality. The apartment is simply worn out. The host admitted the pictures were 3d to represent the layout. Therefore with a 500 GBP deposit, I did not want to make a scene out of it because i was afraid of revenge charge on the deposit. I have 15 reviews on Booking.com and I was never disappointed but this time no choice but to warn other future clients",
          time: Date.now() - 14 * 24 * 60 * 60 * 1000,
          source: "google",
        },
        {
          id: "google-review-3",
          author: "Ahmed Hassan",
          rating: 9,
          text: "Excellent stay. All amenities working perfectly. Close to everything - restaurants, bars, and transport.Si propre, si douillet, si bon Positive: Cette unité a redéfini la propreté et le confort pour nous. L'ambiance était invitante et les petits extras comme les collations et les articles de toilette ont été très appréciés. On sent vraiment que l'hôte se soucie des autres.",
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
    rating: review.rating / 2,
    text: review.text,
    submittedAt: new Date(review.time).toISOString(),
    categories: {},
    status: "approved",
    type: "public",
  }
}
