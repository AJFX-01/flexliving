# Flex Living Reviews Dashboard - Technical Documentation

## System Architecture

### High-Level Overview
The Reviews Dashboard is a full-stack Next.js application that aggregates, normalizes, and displays reviews from multiple sources (Hostaway, Google Places). It provides a secure manager interface for approval workflows and a beautiful public-facing review display.

\`\`\`
┌─────────────────────────────────────────────────────┐
│           Browser / Client Layer                    │
│  ┌──────────────┐        ┌──────────────┐          │
│  │   Dashboard  │        │   Reviews    │          │
│  │   Component  │        │   Page       │          │
│  └──────┬───────┘        └────┬─────────┘          │
│         │                      │                     │
└─────────┼──────────────────────┼────────────────────┘
          │                      │
          ▼                      ▼
┌─────────────────────────────────────────────────────┐
│      Next.js API Routes (Server Layer)              │
│  ┌──────────────────────┐  ┌────────────────────┐  │
│  │  /api/reviews/       │  │ /api/reviews/      │  │
│  │  hostaway/fetch      │  │ google             │  │
│  └──────┬───────────────┘  └────┬───────────────┘  │
│         │                       │                   │
└─────────┼───────────────────────┼───────────────────┘
          │                       │
          ▼                       ▼
    ┌──────────────┐        ┌──────────────┐
    │  Hostaway    │        │   Google     │
    │   API        │        │  Places API  │
    └──────────────┘        └──────────────┘
\`\`\`

## Data Flow

### Review Ingestion Flow

\`\`\`
1. Manager/Guest visits /dashboard or /reviews
   │
2. Component mounts → calls API endpoint
   │
3. API Route (server-side):
   ├─ Validates API key from env
   ├─ Calls Hostaway/Google API with secure credentials
   └─ Returns normalized JSON
   │
4. Client receives normalized data
   │
5. React component renders reviews with state
\`\`\`

### Approval Workflow

\`\`\`
Manager Dashboard:
1. Sees review with status: "pending"
2. Clicks "Approve" button
3. React state updates instantly
4. Next action: save to database (not implemented in mock)
5. Public review display updates

Current Limitation: In-memory state only
→ Refreshing page loses approval changes
→ Production requires database persistence
\`\`\`

## TypeScript Types

### Core Review Types

\`\`\`typescript
// Source review from Hostaway API
interface HostawayReview {
  id: number
  type: "host-to-guest" | "guest-to-host"
  status: "published" | "archived" | "draft"
  rating: number | null
  publicReview: string                    // The actual review text
  reviewCategory: ReviewCategory[]        // Breakdown by category
  submittedAt: string                     // ISO timestamp
  guestName: string
  listingName: string
}

// Source review from Google Places API
interface GoogleReview {
  id: string
  author: string
  rating: number                          // 1-5 stars
  text: string
  time: number                            // Unix timestamp
  source: "google"
}

// Normalized format used throughout app
interface NormalizedReview {
  id: string                              // Unique across all sources
  source: "hostaway" | "google"           // Which platform
  propertyName: string                    // For filtering/grouping
  guestName: string
  rating: number                          // 1-10 scale
  text: string
  submittedAt: string                     // ISO timestamp
  categories: { [key: string]: number }   // Standardized categories
  status: "approved" | "pending" | "rejected"
  type: "host-to-guest" | "guest-to-host" | "public"
}
\`\`\`

### Statistics Type

\`\`\`typescript
interface ReviewStats {
  totalReviews: number
  averageRating: number                   // Calculated average
  approvedCount: number
  pendingCount: number
  categoryBreakdown: {
    cleanliness: number
    communication: number
    respect_house_rules: number
    accuracy: number
    checkin: number
    value: number
  }
  sourceBreakdown: {
    hostaway: number
    google: number
  }
}
\`\`\`

## API Integration Details

### Hostaway API Integration

**Endpoint (Production):**
\`\`\`
GET https://api.hostaway.com/v1/reviews
Headers: Authorization: Bearer {HOSTAWAY_API_KEY}
\`\`\`

**Our Implementation:**
\`\`\`typescript
// app/api/reviews/hostaway/fetch/route.ts
export async function GET() {
  const apiKey = process.env.HOSTAWAY_API_KEY
  
  // Current: Mock data
  // Production: Uncomment and use actual fetch to Hostaway
  // const response = await fetch('https://api.hostaway.com/v1/reviews', {
  //   headers: { 'Authorization': `Bearer ${apiKey}` }
  // })
}
\`\`\`

**Security Implementation:**
- API key stored in `HOSTAWAY_API_KEY` (server env var, no `NEXT_PUBLIC_`)
- Route Handler acts as proxy between client and Hostaway
- No API key exposed to browser/client code
- CORS handled server-side

**Data Transformation:**
\`\`\`typescript
function normalizeHostawayReview(review: HostawayReview): NormalizedReview {
  // Map Hostaway status to app status
  const statusMap = {
    'published': 'approved',    // Published = show publicly
    'draft': 'pending',         // Draft = needs approval
    'archived': 'rejected'      // Archived = don't show
  }
  
  // Calculate average rating from categories
  const avgRating = review.reviewCategory?.length 
    ? Math.round(
        review.reviewCategory.reduce((sum, c) => sum + c.rating, 0) / 
        review.reviewCategory.length
      )
    : 0
    
  return {
    id: `hostaway_${review.id}`,
    source: 'hostaway',
    propertyName: review.listingName,
    guestName: review.guestName,
    rating: avgRating,
    text: review.publicReview,
    submittedAt: review.submittedAt,
    categories: convertCategories(review.reviewCategory),
    status: statusMap[review.status],
    type: review.type
  }
}
\`\`\`

### Google Reviews API Integration

**Endpoint (Production):**
\`\`\`
GET https://maps.googleapis.com/maps/api/place/details/json
Parameters:
  - place_id: {location_id}
  - fields: reviews
  - key: {NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}
\`\`\`

**Our Implementation:**
\`\`\`typescript
// lib/api.ts
async function fetchGoogleReviews() {
  // Current: Mock data for demonstration
  // Production: Fetch from Google Places API for specific place_id
  
  return {
    result: [
      {
        id: 'google_1',
        author: 'Rachel Green',
        rating: 9,
        text: 'Wonderful property with great location',
        time: Date.now()
      }
    ]
  }
}
\`\`\`

**Data Transformation:**
\`\`\`typescript
function normalizeGoogleReview(review: GoogleReview): NormalizedReview {
  // Convert 5-star Google rating to 10-star system
  const rating10 = review.rating * 2
  
  return {
    id: `google_${review.id}`,
    source: 'google',
    propertyName: 'From Google',              // TODO: Map to actual property
    guestName: review.author,
    rating: rating10,
    text: review.text,
    submittedAt: new Date(review.time * 1000).toISOString(),
    categories: extractCategoriesFromText(review.text),
    status: 'pending',                        // Require approval
    type: 'public'
  }
}
\`\`\`

## State Management

### React State Pattern

\`\`\`typescript
// Dashboard component
const [reviews, setReviews] = useState<NormalizedReview[]>([])
const [filteredReviews, setFilteredReviews] = useState<NormalizedReview[]>([])
const [filters, setFilters] = useState({
  status: 'all',
  source: 'all',
  sortBy: 'newest'
})

// Update approval status
const toggleApproval = (id: string, newStatus: 'approved' | 'rejected') => {
  setReviews(reviews.map(r => 
    r.id === id ? { ...r, status: newStatus } : r
  ))
}
\`\`\`

**Limitations of Current Approach:**
- State is in-memory only (lost on page refresh)
- No persistence between sessions
- No conflict resolution if multiple managers editing
- All changes are immediate (no undo)

**Production Improvements Needed:**
- Add database (Supabase/Neon) for persistent storage
- Implement optimistic updates with API calls
- Add revision history/audit logging
- Implement real-time sync via WebSockets or polling

## Component Architecture

### Dashboard Component (`app/dashboard/page.tsx`)

**Responsibilities:**
- Fetch reviews from `/api/reviews/hostaway/fetch` and `/api/reviews/google`
- Manage review list state and filtering
- Render review cards with approve/reject buttons
- Display statistics (total, average rating, source breakdown)

**Key Features:**
\`\`\`typescript
<Dashboard>
  ├─ ReviewStats (displays totals, averages)
  ├─ FilterControls (search, sort, filter by status/source)
  ├─ ReviewCard[] (rendered in grid)
  │  ├─ GuestName & PropertyName
  │  ├─ Rating & Categories
  │  ├─ Review Text
  │  ├─ Approve/Reject Buttons
  │  └─ Source Badge
  └─ Empty State (if no reviews)
\`\`\`

### Reviews Display Component (`app/reviews/page.tsx`)

**Responsibilities:**
- Fetch approved reviews only
- Display in property-grouped layout
- Show reviews in beautiful card format
- Render star ratings and category breakdowns

**Key Features:**
\`\`\`typescript
<ReviewsPage>
  ├─ HeroSection (hero image + intro)
  ├─ PropertyGroup[]
  │  ├─ PropertyHeader (name, address, avg rating)
  │  └─ ReviewCard[]
  │     ├─ GuestName & Date
  │     ├─ Star Rating
  │     ├─ Review Text
  │     ├─ Category Badges
  │     └─ Source Badge
  └─ CallToAction (book property)
\`\`\`

### ReviewCard Component (`components/review-card.tsx`)

**Responsibilities:**
- Display single review in consistent format
- Show all review details (name, rating, categories, source)
- Provide context-aware action buttons (approve/reject for dashboard)

**Props:**
\`\`\`typescript
interface ReviewCardProps {
  review: NormalizedReview
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  showActions?: boolean              // For dashboard
}
\`\`\`

## Design Decisions

### Why Server-Side API Proxy?
- **Security**: API keys never exposed to browser
- **CORS**: No cross-origin issues; all same-origin
- **Rate Limiting**: Control API quota at application level
- **Error Handling**: Centralized error handling and logging

### Why Normalize Data?
- **Consistency**: Same component code for both API sources
- **Flexibility**: Easy to add new sources later
- **Filtering**: Can filter/sort across all sources uniformly
- **Type Safety**: TypeScript ensures consistent interface

### Why Mock Data in Production?
- **Development**: Works without API keys
- **Demonstration**: Shows functionality without external dependencies
- **Testing**: Can test UI without hitting real APIs
- **Transition**: Easy to swap mock for real when ready

### Why Local State vs Database?
- **Simplicity**: MVP can work without database
- **Cost**: No database setup/hosting cost
- **Speed**: Instant updates, no network latency
- **Limitation**: Not persistent across sessions

**Recommendation**: Add database when:
- Need persistent approval states
- Multiple managers should see same changes
- Want to track approval history
- Need to handle high review volumes

### Color & Design Choices
- **Teal Primary**: Matches Flex Living brand
- **Card Layout**: Modern, scannable format
- **Star Ratings**: Universal, immediately understandable
- **Category Badges**: Quick visual breakdown of review quality
- **Source Badges**: Clear indication of review platform

## Performance Considerations

### API Call Optimization
\`\`\`typescript
// Current: Fetch on every page load
useEffect(() => {
  fetchReviews()
}, [])

// Recommended: Add caching
// Option 1: Client-side SWR
import useSWR from 'swr'
const { data } = useSWR('/api/reviews/hostaway/fetch', fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 60000  // Cache 1 minute
})

// Option 2: Server-side caching
// revalidateTag('reviews') in Next.js 16
\`\`\`

### Rendering Optimization
\`\`\`typescript
// Current: All reviews rendered at once
reviews.map(review => <ReviewCard key={review.id} />)

// Recommended: Pagination for large datasets
// Show 20 per page, load more on scroll
\`\`\`

### Image Optimization
- Guest avatars could use Next.js Image component
- Compress/optimize before storage
- Use CDN for distribution

## Testing Strategy

### Unit Tests (Recommended)
\`\`\`typescript
// Test data normalization
describe('normalizeHostawayReview', () => {
  it('should convert draft status to pending', () => {
    const review = { status: 'draft', ... }
    const normalized = normalizeHostawayReview(review)
    expect(normalized.status).toBe('pending')
  })
})
\`\`\`

### Integration Tests (Recommended)
\`\`\`typescript
// Test API routes
describe('GET /api/reviews/hostaway/fetch', () => {
  it('should return array of reviews', async () => {
    const res = await fetch('/api/reviews/hostaway/fetch')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.data.result)).toBe(true)
  })
})
\`\`\`

### E2E Tests (Recommended)
\`\`\`typescript
// Test full workflow (Playwright/Cypress)
describe('Review approval workflow', () => {
  it('should approve a review', async () => {
    page.goto('/dashboard')
    page.click('button[data-action="approve"]')
    // Assert review status changed
  })
})
\`\`\`

## Security Considerations

### API Keys
- ✅ Hostaway key server-only (not `NEXT_PUBLIC_`)
- ✅ Route handler validates key exists
- ✅ Error messages don't expose key
- ⚠️ TODO: Implement API key rotation strategy

### Input Validation
- ✅ Reviews are read-only (no user input)
- ⚠️ TODO: Validate approval status changes
- ⚠️ TODO: Implement approval history/audit log

### Access Control
- ⚠️ TODO: Dashboard should require authentication
- ⚠️ TODO: Only managers can approve reviews
- ⚠️ TODO: Track who approved what and when

### Rate Limiting
- ⚠️ TODO: Implement rate limiting on API routes
- ⚠️ TODO: Set quotas per manager/property
- ⚠️ TODO: Alert on suspicious patterns

## Deployment Checklist

### Before Going Live
- [ ] Add real Hostaway API key to environment
- [ ] Test with real review data
- [ ] Implement database persistence
- [ ] Add authentication to dashboard
- [ ] Set up proper error tracking (Sentry, etc.)
- [ ] Enable HTTPS only
- [ ] Add rate limiting
- [ ] Set up monitoring/alerts
- [ ] Create backup strategy
- [ ] Document runbooks for operations

### Vercel Deployment
\`\`\`bash
# 1. Connect GitHub repo to Vercel
# 2. Add environment variables:
#    - HOSTAWAY_API_KEY
#    - NEXT_PUBLIC_GOOGLE_PLACES_API_KEY (optional)
# 3. Deploy with one click
# 4. Verify /dashboard and /reviews load
\`\`\`

## Troubleshooting Guide

### Reviews Not Loading
1. Check browser Network tab for API errors
2. Verify `/api/reviews/hostaway/fetch` returns 200
3. Check Vercel logs for server errors
4. Confirm `HOSTAWAY_API_KEY` is set

### Styling Issues
1. Clear browser cache (Cmd+Shift+R)
2. Check Tailwind CSS compiled (see built CSS)
3. Verify Tailwind config includes all template paths
4. Check for CSS conflicts in globals.css

### Approval Changes Not Persisting
- **Expected behavior**: Changes lost on page refresh (in-memory state only)
- **Solution**: Implement database persistence

### CORS Errors on Google API
- **Cause**: Direct Google API calls from browser
- **Solution**: Add server-side proxy route for Google API

---

Last Updated: November 2024
