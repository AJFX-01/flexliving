
# **Flex Living Reviews Dashboard — Technical Documentation**

## 🏗 System Architecture

### **High-Level Overview**

The Reviews Dashboard is a full-stack **Next.js** application that aggregates, normalizes, and displays reviews from multiple sources (**Hostaway**, **Google Places**). It provides a secure manager interface for approval workflows and a polished public-facing review display.

```
┌─────────────────────────────────────────────────────┐
│           Browser / Client Layer                    │
│  ┌──────────────┐        ┌──────────────┐          │
│  │   Dashboard  │        │   Reviews    │          │
│  │   Component  │        │   Page       │          │
│  └──────┬───────┘        └────┬─────────┘          │
│         │                      │                   │
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
```

---

## 🔄 Data Flow

### **Review Ingestion Flow**

```
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
```

### **Approval Workflow**

```
Manager Dashboard:
1. Sees review with status: "pending"
2. Clicks "Approve" button
3. React state updates instantly
4. Next action: save to database (not implemented in mock)
5. Public review display updates

Current Limitation: In-memory state only
→ Refreshing page loses approval changes
→ Production requires database persistence
```

---

## 🧩 TypeScript Types

### **Core Review Types**

```typescript
interface HostawayReview {
  id: number
  type: "host-to-guest" | "guest-to-host"
  status: "published" | "archived" | "draft"
  rating: number | null
  publicReview: string
  reviewCategory: ReviewCategory[]
  submittedAt: string
  guestName: string
  listingName: string
}

interface GoogleReview {
  id: string
  author: string
  rating: number
  text: string
  time: number
  source: "google"
}

interface NormalizedReview {
  id: string
  source: "hostaway" | "google"
  propertyName: string
  guestName: string
  rating: number
  text: string
  submittedAt: string
  categories: { [key: string]: number }
  status: "approved" | "pending" | "rejected"
  type: "host-to-guest" | "guest-to-host" | "public"
}
```

### **Statistics Type**

```typescript
interface ReviewStats {
  totalReviews: number
  averageRating: number
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
```

---

## 🌐 API Integration Details

### **Hostaway API Integration**

**Endpoint (Production):**

```
GET https://api.hostaway.com/v1/reviews
Headers: Authorization: Bearer {HOSTAWAY_API_KEY}
```

**Implementation:**

```typescript
// app/api/reviews/hostaway/fetch/route.ts
export async function GET() {
  const apiKey = process.env.HOSTAWAY_API_KEY

  // Mock data for now
  // Production: Uncomment actual fetch
  // const response = await fetch('https://api.hostaway.com/v1/reviews', {
  //   headers: { 'Authorization': `Bearer ${apiKey}` }
  // })
}
```

**Security:**

* Server-only environment variable (`HOSTAWAY_API_KEY`)
* Route handler acts as secure proxy
* No API key exposed to browser
* CORS handled server-side

**Normalization:**

```typescript
function normalizeHostawayReview(review: HostawayReview): NormalizedReview {
  const statusMap = {
    published: 'approved',
    draft: 'pending',
    archived: 'rejected'
  }

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
```

---

### **Google Reviews API Integration**

**Endpoint:**

```
GET https://maps.googleapis.com/maps/api/place/details/json
?place_id={location_id}&fields=reviews&key={NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}
```

**Implementation:**

```typescript
async function fetchGoogleReviews() {
  // Mocked data for demonstration
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
```

**Normalization:**

```typescript
function normalizeGoogleReview(review: GoogleReview): NormalizedReview {
  const rating10 = review.rating * 2

  return {
    id: `google_${review.id}`,
    source: 'google',
    propertyName: 'From Google',
    guestName: review.author,
    rating: rating10,
    text: review.text,
    submittedAt: new Date(review.time * 1000).toISOString(),
    categories: extractCategoriesFromText(review.text),
    status: 'pending',
    type: 'public'
  }
}
```

---

## ⚙️ State Management

```typescript
const [reviews, setReviews] = useState<NormalizedReview[]>([])
const [filteredReviews, setFilteredReviews] = useState<NormalizedReview[]>([])
const [filters, setFilters] = useState({
  status: 'all',
  source: 'all',
  sortBy: 'newest'
})

const toggleApproval = (id: string, newStatus: 'approved' | 'rejected') => {
  setReviews(reviews.map(r =>
    r.id === id ? { ...r, status: newStatus } : r
  ))
}
```

**Limitations:**

* In-memory only
* Lost on refresh
* No sync between managers

**Next Steps:**

* Add database (Supabase/Neon)
* Optimistic updates + API persistence
* Real-time sync via sockets or polling

---

## 🧱 Component Architecture

### **Dashboard (`app/dashboard/page.tsx`)**

* Fetches Hostaway & Google reviews
* Manages filters and stats
* Displays grid of review cards

### **Reviews Page (`app/reviews/page.tsx`)**

* Shows approved reviews
* Grouped by property
* Renders ratings, text, categories

### **ReviewCard (`components/review-card.tsx`)**

* Displays review details
* Approve/reject for dashboard

---

## 🎨 Design & UI

* **Primary color:** Teal (Flex Living brand)
* **Layout:** Modern card grid
* **Badges:** Category and source clarity
* **Ratings:** Intuitive star visuals

---

## 🚀 Deployment

**Checklist**

* [ ] Add API keys
* [ ] Database persistence
* [ ] Auth for dashboard
* [ ] Sentry/error logging
* [ ] HTTPS + rate limiting
* [ ] Monitoring + backup

**Deploy on Vercel**

```bash
# 1. Connect GitHub
# 2. Add ENV vars
# 3. Deploy & verify routes
```

---

## 🧪 Testing Strategy

* **Unit Tests** → Normalization logic
* **Integration Tests** → API endpoints
* **E2E Tests** → Approval workflow

---

## 🔒 Security Considerations

* Server-side API keys only
* Auth required for dashboard (TODO)
* Rate limiting + audit logging (TODO)

---

## 🧰 Troubleshooting

| Issue               | Cause                | Fix                |
| ------------------- | -------------------- | ------------------ |
| Reviews not loading | Missing API key      | Add `.env` vars    |
| Styling broken      | Tailwind build cache | Restart dev server |
| Approval not saving | In-memory only       | Add DB persistence |
| CORS on Google      | Direct API call      | Use server proxy   |

---

**Last Updated:** November 2024

---

