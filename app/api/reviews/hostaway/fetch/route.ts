export async function GET() {
  try {
    const apiKey = process.env.HOSTAWAY_API_KEY
    const accountID = process.env.HOSTAWAY_ACCOUNT_ID
    const token = process.env.TOKEN



    if (!apiKey || !accountID) {
      return Response.json(
        {
          status: "error",
          message: "Hostaway API key not configured",
          result: [],
        },
        { status: 500 },
      )
    }

  //   const data = new URLSearchParams({
  //     grant_type: "client_credentials",
  //     client_id: `${accountID}`,
  //     client_secret: `${apiKey}`,
  //     scope: "general",
  //   });

  //  const res = fetch("https://api.hostaway.com/v1/accessTokens", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //       "Cache-Control": "no-cache",
  //     },
  //     body: data,
  //     credentials: "include",
  //   })
  //     .then((res) => {
  //       if (!res.ok) throw new Error(`Request failed with ${res.status}`);
  //       return res.json();
  //     })
  //     .then((result) => console.log(result))
  //     .catch((err) => console.error(err));

    // console.log(res);
    
    const response = await fetch(`https://api.hostaway.com/v1/reviews`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    console.log(data);
    return Response.json(data)


    // const mockData = {
    //   status: "success",
    //   result: [
    //     {
    //       id: 7453,
    //       type: "host-to-guest",
    //       status: "published",
    //       rating: null,
    //       publicReview: "Had a great time there - recommended. Positive: Great location - easy to get to everything in London. Felt like I was living there and not just staying in a hotel room Negative: Bathrooms need a bit more ventilation",
    //       reviewCategory: [
    //         { category: "cleanliness", rating: 10 },
    //         { category: "communication", rating: 10 },
    //         { category: "respect_house_rules", rating: 10 },
    //       ],
    //       submittedAt: "2024-11-15 22:45:14",
    //       guestName: "Shane Finkelstein",
    //       listingName: "2B N1 A - 29 Shoreditch Heights",
    //     },
    //     {
    //       id: 7454,
    //       type: "guest-to-host",
    //       status: "published",
    //       rating: 9,
    //       publicReview: "Virkelig et Problemfrit Ophold Positive: Fra start til slut var opholdet problemfrit 🌟. Stedet var rent 🧼, atmosfæren afslappende 🌿, og kommunikationen i top 💬. Kunne ikke have ønsket mig mere 🙌.",
    //       reviewCategory: [
    //         { category: "cleanliness", rating: 9 },
    //         { category: "communication", rating: 8 },
    //         { category: "accuracy", rating: 9 },
    //       ],
    //       submittedAt: "2024-11-10 15:30:22",
    //       guestName: "Emma Johnson",
    //       listingName: "3B Loft - Kings Cross",
    //     },
    //     {
    //       id: 7455,
    //       type: "host-to-guest",
    //       status: "draft",
    //       rating: null,
    //       publicReview: "Dostatečné Positive: Dobrá lokalita, ochotný personál. Negative: Ubytování není snadné najít. Fotografie absolutně neodpovídají realitě. Nejsou k dispozici žádné rozkládací pohovky, jen nafukovací matrace, které je nutné si připravit a povléct. Jedna ze dvou matrací byla děravá a přelepená izolepou, což bylo nedostatečné. Personál nám ji ochotně vyměnil za trochu méně hroznou. Nebyla sice děravá, ale byla špinavá a do rána byla poloviční. Při vstupu ucítíte nepříjemný zápach, pravděpodobně z ventilace na záchodě.",
    //       reviewCategory: [
    //         { category: "cleanliness", rating: 10 },
    //         { category: "respect_house_rules", rating: 10 },
    //       ],
    //       submittedAt: "2024-11-08 10:15:00",
    //       guestName: "Michael Chen",
    //       listingName: "2B Modern Studio - Shoreditch",
    //     },
    //   ],
    // }

    // return Response.json(mockData)
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
