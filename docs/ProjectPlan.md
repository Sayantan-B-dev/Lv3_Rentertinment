# Rentertinment MVP — Complete Development TODO Roadmap

## Phase 1 — Project Initialization

**Status:** `Not Started`

### 1.1 Create Project

* [ ] Create Next.js 14 app using App Router
* [ ] Enable TypeScript
* [ ] Initialize Git repository
* [ ] Setup folder structure from SRS
* [ ] Configure path aliases (`@/components`, `@/lib`, etc.)

### 1.2 Install Dependencies

* [ ] Install Tailwind CSS
* [ ] Install shadcn/ui
* [ ] Install mongoose
* [ ] Install next-auth
* [ ] Install zod
* [ ] Install bcryptjs
* [ ] Install slugify
* [ ] Install swr
* [ ] Install imagekitio-next

### 1.3 Configure Base Project

* [ ] Setup Tailwind config
* [ ] Setup globals.css
* [ ] Configure shadcn/ui
* [ ] Configure Next.js image domains
* [ ] Configure ESLint
* [ ] Configure prettier (optional)

### 1.4 Setup Environment Variables

* [ ] Create `.env.local`
* [ ] Add MongoDB URI
* [ ] Add NextAuth secret
* [ ] Add admin credentials
* [ ] Add ImageKit credentials

### 1.5 Setup Database

* [ ] Create MongoDB Atlas project
* [ ] Create database cluster
* [ ] Create database user
* [ ] Whitelist IP
* [ ] Test MongoDB connection
* [ ] Create mongoose singleton connection

### 1.6 Setup Authentication

* [ ] Configure NextAuth credentials provider
* [ ] Create authOptions
* [ ] Create login API route
* [ ] Create login page
* [ ] Protect `/admin/*` routes using middleware

### 1.7 Initial Deployment

* [ ] Push code to GitHub
* [ ] Import project into [Vercel](https://vercel.com?utm_source=chatgpt.com)
* [ ] Add production environment variables
* [ ] Test deployment

---

# Phase 2 — Database Models + Backend APIs

**Status:** `Not Started`

## 2.1 Create Models

### Artist Model

* [ ] Create Artist schema
* [ ] Add indexes
* [ ] Add pre-save hook
* [ ] Test create/update operations

### Inquiry Model

* [ ] Create Inquiry schema
* [ ] Add status enum
* [ ] Add timestamps
* [ ] Test inquiry creation

### Admin Model (optional)

* [ ] Create Admin schema
* [ ] Add password hashing logic

---

## 2.2 Create Utility Functions

* [ ] Create slugify helper
* [ ] Create validators
* [ ] Create formatter helpers
* [ ] Create API response helpers

---

## 2.3 Create Services

### Artist Service

* [ ] Get artists
* [ ] Get artist by slug
* [ ] Create artist
* [ ] Update artist
* [ ] Delete artist
* [ ] Pagination logic
* [ ] Category filtering
* [ ] City filtering

### Search Service

* [ ] MongoDB text search
* [ ] Search highlighting
* [ ] Combined filtering

### Import Service

* [ ] JSON validation
* [ ] Bulk upsert logic
* [ ] Import summary generator

### ImageKit Service

* [ ] Upload helper
* [ ] Image URL helper

---

## 2.4 Create Public APIs

### Artist APIs

* [ ] `GET /api/artists`
* [ ] `GET /api/artists/[slug]`

### Search APIs

* [ ] `GET /api/search`
* [ ] `GET /api/filters`

### Inquiry APIs

* [ ] `POST /api/inquiries`
* [ ] `GET /api/inquiries`
* [ ] `PUT /api/inquiries/[id]`
* [ ] `DELETE /api/inquiries/[id]`

---

## 2.5 Create Admin APIs

### Artist Admin APIs

* [ ] `POST /api/admin/artists`
* [ ] `PUT /api/admin/artists/[id]`
* [ ] `DELETE /api/admin/artists/[id]`

### Dashboard API

* [ ] `GET /api/admin/dashboard`

---

## 2.6 Backend Testing

* [ ] Test all CRUD operations
* [ ] Test search
* [ ] Test filters
* [ ] Test authentication
* [ ] Test protected routes
* [ ] Test JSON imports
* [ ] Test API validation errors

---

# Phase 3 — Public Frontend

**Status:** `Not Started`

## 3.1 Layout Components

* [ ] Create Navbar
* [ ] Create Footer
* [ ] Create MobileMenu
* [ ] Match `demo.html` styling

---

## 3.2 Home Page

* [ ] Create HeroSection
* [ ] Create FeaturedArtists section
* [ ] Create CategoryGrid
* [ ] Create StatsBar
* [ ] Add homepage search

---

## 3.3 Artist Listing

* [ ] Create ArtistCard
* [ ] Create ArtistGrid
* [ ] Create Pagination
* [ ] Create loading skeletons
* [ ] Add empty states

### Filters

* [ ] Category filter
* [ ] City filter
* [ ] URL query sync
* [ ] Pagination query sync

---

## 3.4 Artist Profile Page

* [ ] Create ArtistProfile component
* [ ] Show artist details
* [ ] Show genres
* [ ] Show languages
* [ ] Show about section
* [ ] Show FAQ section
* [ ] Show media gallery
* [ ] Embed YouTube videos

### Booking CTA

* [ ] Create BookingCTA button
* [ ] Open inquiry modal
* [ ] Prefill artist data

---

## 3.5 Search System

* [ ] Create SearchBar
* [ ] Create SearchResults
* [ ] Add debounced search
* [ ] Add loading states
* [ ] Add empty results state

---

## 3.6 Inquiry System

### Inquiry Form

* [ ] Client name field
* [ ] Email field
* [ ] Phone field
* [ ] Event type dropdown
* [ ] Event date picker
* [ ] Message textarea

### Inquiry Submission

* [ ] Validate form
* [ ] Submit to API
* [ ] Show success message
* [ ] Show error handling

---

## 3.7 SEO + Metadata

* [ ] Add `generateMetadata`
* [ ] Add OpenGraph tags
* [ ] Add sitemap generation
* [ ] Add canonical URLs
* [ ] Add robots metadata

---

## 3.8 Performance

* [ ] Configure ISR
* [ ] Configure SSR
* [ ] Optimize images
* [ ] Add lazy loading
* [ ] Optimize queries

---

# Phase 4 — Admin Dashboard

**Status:** `Not Started`

## 4.1 Admin Layout

* [ ] Create AdminSidebar
* [ ] Create protected layout
* [ ] Create dashboard layout
* [ ] Add logout button

---

## 4.2 Dashboard Page

* [ ] Total artists card
* [ ] Total inquiries card
* [ ] Inquiry status cards
* [ ] Recent inquiries table

---

## 4.3 Artist Management

### Artist Table

* [ ] Create ArtistTable
* [ ] Add search
* [ ] Add filtering
* [ ] Add pagination
* [ ] Add edit action
* [ ] Add delete action

### Artist Form

* [ ] Basic info fields
* [ ] Location fields
* [ ] Performance fields
* [ ] FAQ repeater
* [ ] Genre tags input
* [ ] Language tags input
* [ ] Media upload fields

### Artist Actions

* [ ] Create artist
* [ ] Edit artist
* [ ] Delete artist
* [ ] Upload images

---

## 4.4 Inquiry Management

* [ ] Create InquiryTable
* [ ] Show inquiry details
* [ ] Add status dropdown
* [ ] Add delete action
* [ ] Add inquiry search

---

## 4.5 JSON Import System

* [ ] Create ImportPanel
* [ ] Upload JSON file
* [ ] Paste JSON textarea
* [ ] Validate JSON
* [ ] Process bulk import
* [ ] Show import summary
* [ ] Handle failed rows

---

## 4.6 Admin Testing

* [ ] Test login flow
* [ ] Test CRUD operations
* [ ] Test inquiry updates
* [ ] Test bulk imports
* [ ] Test protected routes

---

# Phase 5 — Final Polish + Launch

**Status:** `Not Started`

## 5.1 UI Polish

* [ ] Match final `demo.html`
* [ ] Improve responsive design
* [ ] Improve spacing consistency
* [ ] Improve typography
* [ ] Improve animations

---

## 5.2 Security

* [ ] Validate all APIs
* [ ] Sanitize user inputs
* [ ] Protect admin APIs
* [ ] Secure environment variables
* [ ] Add rate limiting (optional)

---

## 5.3 Final Optimization

* [ ] Lighthouse optimization
* [ ] Optimize bundle size
* [ ] Optimize MongoDB queries
* [ ] Compress images
* [ ] Add loading states everywhere

---

## 5.4 Production Deployment

* [ ] Configure production database
* [ ] Configure production ImageKit
* [ ] Configure production Vercel env vars
* [ ] Add custom domain
* [ ] Enable HTTPS

---

## 5.5 Final QA

* [ ] Test mobile devices
* [ ] Test admin dashboard
* [ ] Test inquiry flow
* [ ] Test search/filter system
* [ ] Test JSON imports
* [ ] Test SEO pages
* [ ] Test deployment stability

---

# MVP Launch Checklist

**Status:** `Not Started`

* [ ] Artists can be added
* [ ] Artists display publicly
* [ ] Search works
* [ ] Filters work
* [ ] Artist profile works
* [ ] Inquiry submission works
* [ ] Admin can manage inquiries
* [ ] Bulk JSON import works
* [ ] Images load correctly
* [ ] SEO metadata exists
* [ ] Site works on mobile
* [ ] Production deployment stable
