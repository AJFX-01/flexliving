# Flex Living Reviews Dashboard

A modern, full-stack reviews management system for the Flex Living property rental platform. Seamlessly integrates reviews from Hostaway and Google Places APIs with a beautiful manager dashboard and public-facing review display.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Hostaway API key (optional for mock data)

### Local Setup

\`\`\`bash
# Clone and install dependencies
git clone <https://github.com/AJFX-01/flexliving.git
cd flex-living
npm install

# Set up environment variables
# Create a .env.local file in the root directory:
HOSTAWAY_API_KEY=your_api_key_here
HOSTAWAY_ACCOUNT_ID=your_account_id_here


# Run development server
npm run dev

# Open your browser to http://localhost:3000
\`\`\`

### Deployment to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `HOSTAWAY_API_KEY` - Your Hostaway API key
   - `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` - Your Google Places API key (optional)
4. Deploy with a single click

## 📋 Features

### Manager Dashboard (`/dashboard`)
- **Search & Filter** - Find reviews by guest name, property, or text content
- **Status Management** - Approve, reject, or keep reviews pending
- **Sorting Options** - Sort by newest, highest, or lowest rating
- **Real-time Statistics** - View total reviews, approval counts, and average ratings
- **Source Filtering** - Filter reviews by Hostaway, Google, or both
- **Category Breakdown** - Visualize review categories (cleanliness, communication, respect for rules)

### Public Review Display (`/reviews`)
- **Beautiful Property Listings** - Modern card-based layout matching Flex Living's design
- **Approved Reviews Only** - Only shows publicly approved reviews to guests
- **Multi-source Reviews** - Combines reviews from both Hostaway and Google with source badges
- **Responsive Design** - Optimized for mobile, tablet, and desktop viewing
- **Rating Display** - Star ratings and category breakdowns visible to potential guests

### API Routes
- **`/api/reviews/hostaway/fetch`** - Secure server-side Hostaway API integration
- **`/api/reviews/google`** - Google Places reviews with normalization

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Component Library** | shadcn/ui |
| **State Management** | React Hooks with local state |
| **API Integration** | Server Actions & Route Handlers |
| **Data Fetching** | Native fetch API |

## 📐 Architecture & Design Decisions

### Security
- **API Keys on Server Only** - Hostaway API key kept in server-side environment variables (not exposed to browser)
- **Secure Route Handler** - `/api/reviews/hostaway/fetch` acts as a proxy to protect credentials
- **No Direct API Exposure** - Client-side code calls your app's endpoints, not third-party APIs directly

### Data Normalization
All reviews from different sources are normalized into a unified `NormalizedReview` format:
\`\`\`typescript
{
  id: string                    // Unique identifier
  source: "hostaway" | "google" // Review source
  propertyName: string          // Property being reviewed
  guestName: string             // Guest/reviewer name
  rating: number                // 1-10 rating
  text: string                  // Review text
  submittedAt: string           // ISO timestamp
  categories: { [key]: number } // Category ratings
  status: "approved" | "pending" | "rejected"
  type: "host-to-guest" | "guest-to-host" | "public"
}
\`\`\`

### State Management
- **Local React State** - Reviews state stored in component with `useState`
- **Mock Data Ready** - Current implementation uses mock data; production integration involves replacing mock arrays with API calls
- **Real-time Updates** - Approval status changes immediately reflected in UI (in-memory state)

### Responsive Design
- **Mobile-First Approach** - Base styles optimized for mobile, enhanced with responsive prefixes
- **Tailwind Breakpoints** - `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- **Flexible Grids** - `grid-cols-1` → `md:grid-cols-2` → `lg:grid-cols-3` for automatic responsiveness
- **Touch-Friendly** - Larger buttons and spacing for mobile users

## 🔌 API Behaviors

### Hostaway Reviews API (`/api/reviews/hostaway/fetch`)

**Request:**
\`\`\`
GET /api/reviews/hostaway/fetch
\`\`\`

**Response (Success):**
\`\`\`json
{
  "status": "success",
  "result": [
    {
      "id": 7453,
      "type": "host-to-guest",
      "status": "published",
      "rating": null,
      "publicReview": "Amazing stay!",
      "reviewCategory": [
        { "category": "cleanliness", "rating": 10 }
      ],
      "submittedAt": "2024-11-15 22:45:14",
      "guestName": "Shane Finkelstein",
      "listingName": "2B N1 A - 29 Shoreditch Heights"
    }
  ]
}
\`\`\`

**Response (Error):**
\`\`\`json
{
  "status": "error",
  "message": "Hostaway API key not configured",
  "result": []
}
\`\`\`

**Key Points:**
- Returns mock data by default (ready for production API integration)
- API key fetched from `HOSTAWAY_API_KEY` server environment variable
- Statuses: `published`, `archived`, `draft`
- Review types: `host-to-guest` (host reviews guest), `guest-to-host` (guest reviews host)

### Google Reviews API (`/api/reviews/google`)

**Request:**
\`\`\`
GET /api/reviews/google
\`\`\`

**Response (Success):**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "google_1",
      "source": "google",
      "propertyName": "29 Shoreditch Heights",
      "guestName": "Rachel Green",
      "rating": 9,
      "text": "Wonderful property with great location",
      "submittedAt": "2024-11-20T10:30:00Z",
      "categories": { "cleanliness": 9, "value": 9 },
      "status": "approved",
      "type": "public"
    }
  ],
  "stats": {
    "total": 1,
    "averageRating": "9.0"
  }
}
\`\`\`

**Key Points:**
- Currently returns mock data for exploration and testing
- Uses normalized format for consistency with Hostaway reviews
- Google Places API integration ready (see Integration Guide below)
- Automatic rating calculation and statistics

## 🔍 Google Reviews Integration Findings

### Current Status
- **Mock Data**: Currently demonstrates data structure and UI capabilities
- **API Ready**: Code structure prepared for real Google Places API integration

### To Integrate Real Google Reviews

1. **Get Google Places API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable "Places API" and "Maps JavaScript API"
   - Create an API key (credentials tab)

2. **Add Environment Variable**
   - Add to your `.env.local`:
   \`\`\`
   NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_api_key_here
   \`\`\`

3. **Update API Call**
   - In `lib/api.ts`, replace the mock data in `fetchGoogleReviews()` with:
   \`\`\`typescript
   const response = await fetch(
     `https://maps.googleapis.com/maps/api/place/details/json?` +
     `place_id=${placeId}&fields=reviews&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`
   );
   const data = await response.json();
   return data.result.reviews.map(review => ({...}));
   \`\`\`

4. **Place ID Lookup**
   - Get `placeId` from Google Places API Text Search for your property
   - Store mapping between properties and their Google Place IDs

### API Rate Limits
- Google Places API: 1000 requests/day free tier
- Each property review fetch = 1 request
- Consider caching strategy for high-traffic properties

### Considerations
- **Authentication**: Google API key is public-facing (OK for Google Maps API)
- **Filtering**: Google reviews cannot be pre-filtered server-side; filter in app
- **Sync Strategy**: Consider cron job to sync Google reviews periodically
- **Moderation**: No built-in moderation for Google reviews; use dashboard to manage display

## 📁 Project Structure

\`\`\`
flex-living-reviews/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── globals.css             # Tailwind + theme configuration
│   ├── page.tsx                # Home page with links to dashboard/reviews
│   ├── dashboard/
│   │   └── page.tsx            # Manager dashboard
│   ├── reviews/
│   │   └── page.tsx            # Public review display
│   └── api/
│       └── reviews/
│           ├── hostaway/
│           │   └── fetch/route.ts  # Secure Hostaway API proxy
│           └── google/
│               └── route.ts        # Google reviews endpoint
├── components/
│   └── dashboard-reveiw.tsx    # Reusable review card component
│   └── review-card.tsx         # Reusable review card component
│   └── review-text.tsx         # Reusable review text component
│   └── modal-content.tsx       # Reusable modal content component
│   └── modal.tsx               # Reusable modal component
├── lib/
│   ├── api.ts                  # API integration functions
│   └── types.ts                # TypeScript type definitions
└── public/                     # Static assets
\`\`\`

## 🎨 Design System

### Color Palette (Flex Living Theme)
- **Primary**: Teal/Green (`oklch(0.32 0.11 178)`)
- **Background**: Off-white with subtle tones
- **Text**: Dark gray for readability
- **Accent**: Derived from primary for interactive elements

### Typography
- **Headings**: Clean sans-serif with 1.2-1.3 line height
- **Body Text**: Optimized 1.4-1.6 line height for readability
- **Responsive**: Font sizes scale from mobile to desktop

### Component Patterns
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Primary (teal), secondary (outline), danger (red)
- **Inputs**: Full-width with clear focus states
- **Status Badges**: Visual indicators for review approval status

## 🚦 Key Integration Points

### Adding a New Property
1. Reviews are fetched for all properties via API
2. Add property to mock data in API routes
3. Dashboard filters by property automatically

### Updating Approval Status
1. Manager clicks approve/reject button in dashboard
2. State updates in React component (in-memory)
3. In production, persist to database and sync to public display

### Syncing Reviews
- Current: Manual/on-demand via API calls
- Recommended: Set up cron job to sync reviews hourly/daily
- Store in database to enable persistent approval states

## 📚 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HOSTAWAY_API_KEY` | Optional | Hostaway API key for secure server-side calls |
| `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` | Optional | Google Places API key for public-side integration |

## 🐛 Troubleshooting

**Reviews not loading?**
- Check browser console for API errors
- Verify API keys are set in environment variables
- Confirm API endpoints are accessible

**Styling looks off on mobile?**
- Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
- Check Tailwind CSS build process
- Verify responsive classes are applied

**API key errors?**
- Ensure `HOSTAWAY_API_KEY` is set (not `NEXT_PUBLIC_` prefix on server)
- Check Vercel deployment environment variables
- Regenerate API keys if credentials compromised

## 📞 Support & Next Steps

- **Next Phase**: Connect to real Hostaway API and database
- **Database**: Add persistent storage for approval states (Supabase/Neon)
- **Moderation**: Build advanced filtering and bulk approval tools
- **Analytics**: Track review trends and guest satisfaction over time
- **Notifications**: Alert managers of new reviews automatically

---

Built with Next.js, TypeScript, and Tailwind CSS for Flex Living.
