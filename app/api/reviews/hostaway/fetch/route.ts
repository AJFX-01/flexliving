export async function GET() {
  try {
    // const apiKey = process.env.HOSTAWAY_API_KEY
    // const accountID = process.env.HOSTAWAY_ACCOUNT_ID


    // if (!apiKey || !accountID) {
    //   return Response.json(
    //     {
    //       status: "error",
    //       message: "Hostaway API key not configured",
    //       result: [],
    //     },
    //     { status: 500 },
    //   )
    // }

    
    // const response = await fetch(`https://api.hostaway.com/v1/reviews?accountId=${accountID}`, {
    //   headers: { 'Authorization': `Bearer ${apiKey}` }
    // });
    // const data = await response.json();
    // console.log(data);
    // return Response.json(data)


    const mockData = {
      status: "success",
      result: [
        {
          id: 7453,
          type: "host-to-guest",
          status: "published",
          rating: null,
          publicReview: "Shane and family are wonderful! Would definitely host again :)",
          reviewCategory: [
            { category: "cleanliness", rating: 10 },
            { category: "communication", rating: 10 },
            { category: "respect_house_rules", rating: 10 },
          ],
          submittedAt: "2024-11-15 22:45:14",
          guestName: "Shane Finkelstein",
          listingName: "2B N1 A - 29 Shoreditch Heights",
        },
        {
          id: 7454,
          type: "guest-to-host",
          status: "published",
          rating: 9,
          publicReview: "Beautiful property, great location. A few minor issues with WiFi",
          reviewCategory: [
            { category: "cleanliness", rating: 9 },
            { category: "communication", rating: 8 },
            { category: "accuracy", rating: 9 },
          ],
          submittedAt: "2024-11-10 15:30:22",
          guestName: "Emma Johnson",
          listingName: "3B Loft - Kings Cross",
        },
        {
          id: 7455,
          type: "host-to-guest",
          status: "draft",
          rating: null,
          publicReview: "Excellent guests, kept everything clean and tidy. Highly recommended!",
          reviewCategory: [
            { category: "cleanliness", rating: 10 },
            { category: "respect_house_rules", rating: 10 },
          ],
          submittedAt: "2024-11-08 10:15:00",
          guestName: "Michael Chen",
          listingName: "2B Modern Studio - Shoreditch",
        },
      ],
    }

    return Response.json(mockData)
  } catch (error) {
    console.error("Hostaway API error:", error)
    return Response.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        result: [],
      },
      { status: 500 },
    )
  }
}
