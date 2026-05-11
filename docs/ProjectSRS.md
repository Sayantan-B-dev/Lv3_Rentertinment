# Software Requirements Specification
## BlueEye — Indian Artists Booking Platform (MVP)

---

## 1. Project Overview

BlueEye is a Next.js 14 web application that enables discovery and booking inquiries for Indian performing artists — singers, bands, comedians, dancers, DJs, and more. Admins manage the artist catalogue via a secure dashboard and can bulk‑import artists from JSON. Visitors browse, search, and filter artists by category, city, genre, and language, then submit a booking inquiry that is stored for admin follow‑up.

**Version 1 (MVP)** focuses on the core loop: artist discovery → profile view → inquiry submission → admin management. No event management, vendor system, calendar, quotations, or payments are included in the initial release.

---

## 2. Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 14 (App Router) | SSR + SSG + ISR, file‑based routing |
| Database | MongoDB Atlas | Flexible schema, text search |
| ODM | Mongoose | Schema validation, pre‑save hooks (schema already defined) |
| Auth | NextAuth.js (Credentials) | Simple admin‑only auth, JWT sessions |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI, accessible components; actual styling follows `demo.html` |
| Image Hosting | ImageKit.io | Optimised image delivery, transforms, CDN |
| Deployment | Vercel | Zero‑config Next.js deploys |
| Env secrets | `.env.local` + Vercel env vars | Never commit secrets |

> **Styling note**: The visual design (colors, typography, spacing, component appearance) is not specified in this SRS. It will be implemented based on a provided `demo.html` file. The tech stack (Tailwind + shadcn/ui) is used for implementation efficiency but the final look and feel must match the demo.

---

## 3. Folder Structure

```
BlueEye/
├── app/
│   ├── layout.tsx                  # Root layout (no theme provider – style from demo.html)
│   ├── page.tsx                    # / Home
│   ├── not-found.tsx
│   ├── loading.tsx
│   │
│   ├── artists/
│   │   ├── page.tsx                # /artists (paginated browse)
│   │   └── [slug]/
│   │       └── page.tsx            # /artists/[slug] (profile)
│   │
│   ├── category/
│   │   └── [category]/
│   │       └── page.tsx            # /category/singer etc.
│   │
│   ├── city/
│   │   └── [city]/
│   │       └── page.tsx            # /city/mumbai etc.
│   │
│   ├── search/
│   │   └── page.tsx                # /search?q=...
│   │
│   ├── about/
│   │   └── page.tsx
│   │
│   ├── contact/
│   │   └── page.tsx                # (optional – can be merged with inquiry modal)
│   │
│   ├── admin/
│   │   ├── layout.tsx              # Admin shell with sidebar, auth guard
│   │   ├── page.tsx                # /admin Dashboard (stats)
│   │   ├── login/
│   │   │   └── page.tsx            # /admin/login
│   │   ├── artists/
│   │   │   ├── page.tsx            # /admin/artists (data table)
│   │   │   ├── new/
│   │   │   │   └── page.tsx        # /admin/artists/new
│   │   │   └── [id]/
│   │   │       └── page.tsx        # /admin/artists/[id] (edit)
│   │   ├── inquiries/
│   │   │   └── page.tsx            # /admin/inquiries (list, status update)
│   │   ├── import/
│   │   │   └── page.tsx            # /admin/import (JSON bulk upload)
│   │   └── settings/
│   │       └── page.tsx            # /admin/settings (password change)
│   │
│   └── api/
│       ├── artists/
│       │   ├── route.ts            # GET /api/artists
│       │   └── [slug]/
│       │       └── route.ts        # GET /api/artists/[slug]
│       ├── search/
│       │   └── route.ts            # GET /api/search
│       ├── filters/
│       │   └── route.ts            # GET /api/filters (categories, cities)
│       ├── inquiries/
│       │   ├── route.ts            # POST (public), GET (admin)
│       │   └── [id]/
│       │       └── route.ts        # PUT (update status), DELETE
│       ├── admin/
│       │   ├── artists/
│       │   │   ├── route.ts        # POST (create), bulk import
│       │   │   └── [id]/
│       │   │       └── route.ts    # PUT, DELETE
│       │   └── dashboard/
│       │       └── route.ts        # GET stats (artist count, inquiry count)
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── MobileMenu.tsx
│   ├── artists/
│   │   ├── ArtistCard.tsx
│   │   ├── ArtistGrid.tsx
│   │   ├── ArtistProfile.tsx
│   │   ├── ArtistMediaGallery.tsx   # Uses ImageKit for images
│   │   ├── ArtistFAQ.tsx
│   │   └── BookingCTA.tsx           # Opens inquiry form modal
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   ├── FilterPanel.tsx
│   │   └── SearchResults.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedArtists.tsx
│   │   ├── CategoryGrid.tsx
│   │   └── StatsBar.tsx
│   ├── inquiries/
│   │   ├── InquiryForm.tsx
│   │   └── InquiryTable.tsx         # Admin view
│   ├── admin/
│   │   ├── AdminSidebar.tsx
│   │   ├── ArtistForm.tsx           # Mirrors the Artist schema
│   │   ├── ArtistTable.tsx
│   │   └── ImportPanel.tsx
│   └── ui/                          # shadcn/ui re‑exports + custom
│       ├── Badge.tsx
│       ├── Pagination.tsx
│       ├── LoadingSkeleton.tsx
│       └── DataTable.tsx
│
├── lib/
│   ├── db/
│   │   └── connect.ts               # Mongoose singleton
│   ├── models/
│   │   ├── Artist.ts                # Exact schema provided (see section 6)
│   │   ├── Inquiry.ts               # Booking inquiry schema
│   │   └── (no other models)
│   ├── services/
│   │   ├── artistService.ts         # CRUD + query logic (respects schema)
│   │   ├── searchService.ts         # $text search + lower‑field filters
│   │   ├── importService.ts         # JSON validation + bulk upsert
│   │   └── imageKitService.ts       # Image upload helper
│   ├── auth/
│   │   └── authOptions.ts           # NextAuth config (single admin from env)
│   └── utils/
│       ├── slugify.ts
│       ├── formatters.ts
│       └── validators.ts            # Zod schemas
│
├── hooks/
│   ├── useArtists.ts                # SWR / React Query
│   ├── useSearch.ts
│   └── useTheme.ts                  # (only if demo.html includes dark mode)
│
├── types/
│   ├── artist.ts                    # TypeScript interface matching schema
│   └── inquiry.ts
│
├── public/
│   ├── images/
│   └── icons/
│
├── styles/
│   └── globals.css                  # Minimal base – actual style from demo.html
│
├── middleware.ts                    # Protect /admin/* routes
├── next.config.js
├── tailwind.config.ts
├── .env.local
└── package.json
```

---

## 4. All Routes

### 4.1 Public Routes

| Route | Page | Data source | Rendering |
|-------|------|-------------|-----------|
| `/` | Home | Featured artists, counts | SSG + ISR (1hr) |
| `/artists` | Browse all (paginated) | `GET /api/artists` | SSR |
| `/artists/[slug]` | Artist profile | `GET /api/artists/[slug]` | SSG + ISR |
| `/category/[category]` | Artists by category | `GET /api/artists?category=` | SSR |
| `/city/[city]` | Artists by city | `GET /api/artists?city=` | SSR |
| `/search` | Search results | `GET /api/search?q=&...` | SSR (no cache) |
| `/about` | About BlueEye | Static | SSG |
| `/contact` | General contact (optional) | Static + form | SSG |

**Query params for list pages**: `?page=N&sort=name|recent&limit=12`

### 4.2 Admin Routes (protected)

| Route | Purpose |
|-------|---------|
| `/admin/login` | Admin sign‑in (credentials) |
| `/admin` | Dashboard — total artists, total inquiries, inquiries by status, recent inquiries |
| `/admin/artists` | Manage artists: data table with edit/delete |
| `/admin/artists/new` | Create single artist via form |
| `/admin/artists/[id]` | Edit existing artist |
| `/admin/inquiries` | View all booking inquiries, update status (New / Contacted / Closed) |
| `/admin/import` | Paste or upload JSON array to bulk‑upsert artists |
| `/admin/settings` | Change admin password |

### 4.3 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/artists` | No | List artists (filters: category, city, page, limit, sort) |
| GET | `/api/artists/[slug]` | No | Single artist by slug |
| GET | `/api/search` | No | Full‑text + filter search |
| GET | `/api/filters` | No | Distinct categories, cities (for dropdowns) |
| POST | `/api/inquiries` | No | Submit a booking inquiry |
| GET | `/api/inquiries` | Yes | List all inquiries (admin) |
| PUT | `/api/inquiries/[id]` | Yes | Update inquiry status |
| DELETE | `/api/inquiries/[id]` | Yes | Delete inquiry |
| POST | `/api/admin/artists` | Yes | Create one artist or bulk import array |
| PUT | `/api/admin/artists/[id]` | Yes | Update artist (full update) |
| DELETE | `/api/admin/artists/[id]` | Yes | Delete artist |
| GET | `/api/admin/dashboard` | Yes | Stats (artist count, inquiry counts by status) |

---

## 5. Core Features

### 5.1 Public Site

**Home page** – Layout and styling based on `demo.html`. Includes:
- Hero section with search bar.
- Featured artists carousel (artists with `featured` flag – note the provided schema does not have `featured`; this can be added as an extra field or determined by a static list).
- Category grid (Singer, Band, Comedian, Dancer, DJ).
- Stats bar (total artists, number of cities, languages – computed from database).
- Brief "How it works" strip.

**Artist profile** – Displays all fields from the schema:
- Name, category, location (city, state).
- About text.
- Performance details: duration minutes (min/max), team members (min/max), genres, languages.
- Media gallery: images (from `media.images`) optimised via ImageKit, YouTube videos (from `media.videos`).
- FAQ section (from `faq` array).
- Booking CTA button that opens an inquiry modal. The modal pre‑fills the artist name/slug.

**Browse & filter** – Paginated grid of artists. Filtering by category and city (both from the `location.city` field and `search.city_lower`). Filters update URL query parameters for shareable links. Each artist card shows primary image, name, category, city, and first two genres.

**Search** – Debounced search input that calls `/api/search`. Uses MongoDB `$text` index (on `name`, `about`, `category`) plus optional filters. Results highlighted.

**Inquiry form** – Modal or dedicated page capturing:
- Artist (automatically selected from profile page).
- Client name, email, phone.
- Event date (optional).
- Event type (dropdown: Wedding, Corporate, Private Party, College, Other).
- Message.
On submission, creates an `Inquiry` document in the database.

### 5.2 Admin Panel

**Login** – Credentials provider (single admin). Admin email and bcrypt password stored in environment variables.

**Dashboard** – Shows:
- Total artists count.
- Total inquiries count.
- Inquiries by status (New, Contacted, Closed) – chart or cards.
- Recent inquiries (latest 5).

**Artist management** – Full CRUD:
- Data table with columns: name, category, city, updated at, actions.
- Search/filter table client‑side (or server‑side).
- Create/Edit form covers all schema fields:
  - Basic: name, slug (auto‑generated if empty), category, source (url, input_category, input_page).
  - Location: city, state, country.
  - Performance: duration_minutes.min/max, team_members.min/max, genres (tag input), languages (tag input).
  - Booking: url.
  - About (textarea).
  - FAQ (list of question/answer pairs, add/remove).
  - Media: images (ImageKit URLs), videos (YouTube URLs).
- Images uploaded via ImageKit (admin provides URLs after upload – or direct ImageKit upload widget).
- Validation with Zod before submission.

**Inquiry management** – Table showing:
- Artist name (link to artist profile), client name, email, phone, event date, event type, status, created date.
- Inline status dropdown (New, Contacted, Closed).
- Delete action.

**JSON import** – Admin can paste a JSON array (matching the Artist schema) or upload a `.json` file. The import service:
- Validates each object against a Zod schema.
- Auto‑generates `slug` from `name` if missing.
- Upserts by `slug` (creates new or updates existing).
- Calls the pre‑save hook automatically because Mongoose `save()` is used for each document (or uses `bulkWrite` with manual lower‑field generation).
- Returns a summary per record: created / updated / skipped with reason.

**Settings** – Allows admin to change password (hash and update `.env` is not possible at runtime; instead, store password hash in a database collection for admin user – simple one‑doc collection). Or keep env‑based and require redeploy. For MVP, we can add an `Admin` model with a single document.

**Middleware** – Protects all `/admin/*` routes except `/admin/login`. Redirects to login if no valid NextAuth session.

---

## 6. Data Models

### 6.1 Artist Model (exactly as provided)

The schema is fixed and must be used without modification except possibly adding a `featured` boolean flag (if needed for home page carousel). The provided schema:

```js
// lib/models/Artist.js (or .ts)
import mongoose from "mongoose";

const durationSchema = new mongoose.Schema({ min: Number, max: Number }, { _id: false });
const teamMembersSchema = new mongoose.Schema({ min: Number, max: Number }, { _id: false });
const sourceSchema = new mongoose.Schema({
  url: { type: String, required: true, trim: true },
  input_category: { type: String, default: null, trim: true },
  input_page: { type: Number, default: null }
}, { _id: false });
const locationSchema = new mongoose.Schema({
  city: String, state: String, country: { type: String, default: "India" }
}, { _id: false });
const performanceSchema = new mongoose.Schema({
  duration_minutes: durationSchema,
  team_members: teamMembersSchema,
  genres: [String],
  languages: [String]
}, { _id: false });
const bookingSchema = new mongoose.Schema({ url: String }, { _id: false });
const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });
const mediaSchema = new mongoose.Schema({
  videos: [String],
  images: [String]
}, { _id: false });
const searchSchema = new mongoose.Schema({
  name_lower: String,
  category_lower: String,
  city_lower: String,
  genres_lower: [String],
  languages_lower: [String]
}, { _id: false });

const artistSchema = new mongoose.Schema({
  id: { type: Number, unique: true, sparse: true },
  slug: { type: String, required: true, unique: true, trim: true, index: true },
  name: { type: String, required: true, trim: true, index: true },
  category: { type: String, required: true, trim: true, index: true },
  source: sourceSchema,
  location: locationSchema,
  performance: performanceSchema,
  booking: bookingSchema,
  about: String,
  faq: [faqSchema],
  media: mediaSchema,
  search: searchSchema
}, { timestamps: true, versionKey: false });

artistSchema.index({ name: "text", about: "text", category: "text" });

artistSchema.pre("save", function (next) {
  this.search = {
    name_lower: this.name?.toLowerCase() || "",
    category_lower: this.category?.toLowerCase() || "",
    city_lower: this.location?.city?.toLowerCase() || "",
    genres_lower: this.performance?.genres?.map(g => g.toLowerCase()) || [],
    languages_lower: this.performance?.languages?.map(l => l.toLowerCase()) || []
  };
  next();
});

export default mongoose.models.Artist || mongoose.model("Artist", artistSchema);
```

**Optional addition for MVP**: a `featured` boolean field to control home page carousel. If added, it is not in the original schema but can be appended safely.

### 6.2 Inquiry Model

```js
// lib/models/Inquiry.js
import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema({
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
  artistName: { type: String, required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, required: true },
  eventDate: Date,
  eventType: { type: String, enum: ["Wedding", "Corporate", "Private Party", "College", "Other"] },
  message: String,
  status: { type: String, enum: ["New", "Contacted", "Closed"], default: "New" },
  notes: String
}, { timestamps: true });

export default mongoose.models.Inquiry || mongoose.model("Inquiry", InquirySchema);
```

### 6.3 Admin Model (optional for settings)

If password change is required without redeploy, store a single admin document:

```js
// lib/models/Admin.js
import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
```

For MVP, it is acceptable to keep the password in env and skip runtime changes. The SRS assumes env‑based admin for simplicity.

---

## 7. Search & Filter Query Pattern

### Artist list (with category/city filters)

```typescript
// lib/services/artistService.ts
export async function getArtists(params: { category?: string; city?: string; page?: number; limit?: number }) {
  const filter: any = {}; // no status field in schema – all artists are published
  if (params.category) filter["search.category_lower"] = params.category.toLowerCase();
  if (params.city) filter["search.city_lower"] = params.city.toLowerCase();

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(24, params.limit || 12);
  const skip = (page - 1) * limit;

  const [artists, total] = await Promise.all([
    Artist.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Artist.countDocuments(filter)
  ]);
  return { artists, total, page, totalPages: Math.ceil(total / limit) };
}
```

### Full‑text search

```typescript
export async function searchArtists(q: string, filters?: any) {
  const query: any = { $text: { $search: q } };
  if (filters?.category) query["search.category_lower"] = filters.category.toLowerCase();
  if (filters?.city) query["search.city_lower"] = filters.city.toLowerCase();
  return Artist.find(query, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .lean();
}
```

### Distinct filters for UI

```typescript
export async function getDistinctCategories() {
  return Artist.distinct("category");
}
export async function getDistinctCities() {
  return Artist.distinct("location.city");
}
```

---

## 8. Styling

No custom theme or CSS variables are defined in this SRS. The entire visual appearance (colors, fonts, spacing, responsive breakpoints, component shapes) must match the provided `demo.html`. The development team will:

- Use Tailwind CSS utility classes to replicate the demo’s design.
- Use shadcn/ui components (Button, Card, Dialog, etc.) as a base and style them to match the demo.
- Not invent new color schemes or layout patterns beyond what the demo shows.

If the demo includes dark/light mode, implement it using `next-themes` and the demo’s specific class names. Otherwise, no theme toggle is required.

---

## 9. Environment Variables

```bash
# .env.local
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<openssl rand -base64 32>
ADMIN_EMAIL=admin@BlueEye.in
ADMIN_PASSWORD_HASH=<bcrypt hash>

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

---

## 10. SEO & Metadata

All public pages export `generateMetadata`. For artist profiles:
- Title: `{artist.name} – Book for {artist.category} performance in {artist.location.city} | BlueEye`
- Description: First 150 characters of `artist.about`
- OpenGraph image: first image from `artist.media.images` (if exists)
- Canonical URL: `/artists/{artist.slug}`

Sitemap generation: `sitemap.ts` will fetch all artist slugs and produce entries.

---

## 11. Performance Strategy

- ISR for home page, category/city pages (`revalidate: 3600`).
- Artist profiles use `generateStaticParams` for artists where `featured` flag is true (or top 100 by id) – fallback to blocking SSR for others.
- Images from ImageKit are served via `next/image` with `loader` configuration.
- MongoDB connection cached globally (singleton) to prevent connection exhaustion in serverless.

---

## 12. Key Dependencies

```json
{
  "next": "14.x",
  "react": "18.x",
  "mongoose": "8.x",
  "next-auth": "^4.x",
  "zod": "^3.x",
  "tailwindcss": "^3.x",
  "@radix-ui/react-*": "shadcn/ui primitives",
  "bcryptjs": "^2.x",
  "slugify": "^1.x",
  "swr": "^2.x",
  "imagekitio-next": "^1.x"
}
```

---

## 13. Future Features (Post‑MVP)

The following capabilities are **excluded** from Version 1 but can be added later:

- Artist `status` field (draft/published) – not in original schema, but can be added if needed.
- Featured artists carousel on home – can be implemented by adding a `featured` flag.
- Advanced analytics (booking conversion, popular categories).
- Email notifications for new inquiries (using Resend).
- Bulk export of inquiries to CSV.
- Public vendor/venue directories.
- Event management (timelines, tasks, logistics).
- Quotations and invoicing.
- Online payments.
- Availability calendar for artists.
- Multi‑admin roles.
- Real‑time updates.

These features are not required for initial launch and will be considered based on user feedback.