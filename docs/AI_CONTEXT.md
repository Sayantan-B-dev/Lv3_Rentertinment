# AI Context

This repository is developed using multiple AI agents, IDEs, accounts, devices, and contributors.

Before making any change, read the project documents in the exact order below.

---

# Required Reading Order

1. `ProjectDemo.html`
   - Primary UI and visual source of truth.
   - Follow layout, spacing, responsiveness, component structure, and interaction patterns.

2. `ProjectPlan.md`
   - Contains current progress, completed tasks, and remaining work.
   - Continue from the next unfinished task whenever possible.

3. `ProjectSRS.md`
   - Highest source of truth for architecture, routes, schemas, APIs, rendering strategy, and product scope.
   - Never invent features outside the SRS.

4. `ProjectTree.md`
   - Contains latest known project structure.
   - Check before creating, moving, renaming, or deleting files.

5. `ProjectLog.md`
   - Contains latest project state, major decisions, current priorities, and architecture notes.

6. `logs/YYYY-MM.md`
   - Contains detailed chronological development logs and file-level changes.

---

# SRS Priority Rule

If assumptions conflict with implementation details,
follow `ProjectSRS.md`.

Do not override SRS decisions unless explicitly updated in:
- `ProjectPlan.md`
- `ProjectLog.md`

---

# Core Development Rules

- Follow `ProjectDemo.html` strictly for frontend implementation.
- Keep UI clean, responsive, reusable, and visually consistent.
- Prefer reusable components over duplicated code.
- Keep components modular and isolated.
- Keep business logic outside UI components whenever possible.
- Keep admin functionality separated from public functionality.
- Maintain predictable folder organization.
- Prefer simple architecture over unnecessary abstraction.
- Prefer readability over cleverness.
- Prefer incremental improvements over massive rewrites.
- Maintain exact schema compatibility across frontend and backend.
- Maintain consistent naming conventions across the project.
- Maintain scalable but low-complexity architecture decisions.

---

# Documentation Rules

After completing work:

- Update `ProjectLog.md` for important project-level updates.
- Update `logs/YYYY-MM.md` for detailed chronological changes.
- Update `ProjectPlan.md` when tasks are completed.
- Update `ProjectTree.md` after major structure changes.

If the current monthly log does not exist:
- create `logs/YYYY-MM.md`

---

# Logging Format

Use compact entries.

Example:

- `app/page.tsx` => rebuilt homepage hero
- `components/home/HeroSection.tsx` => added search section
- `lib/models/Artist.ts` => added indexes
- `app/api/search/route.ts` => optimized filters

Avoid long explanations inside logs.

---

# Architecture Rules

Frontend:
- Next.js App Router
- TypeScript
- TailwindCSS
- shadcn/ui only as implementation utility

Backend:
- Next.js Route Handlers
- MongoDB
- Mongoose

Authentication:
- NextAuth
- Single admin system

Media:
- ImageKit CDN

State/Data:
- SWR or lightweight fetching
- Avoid heavy global state initially

---

# Database Rules

Primary models:
- Artist
- Inquiry

Optional:
- Admin

Do not create unnecessary models unless explicitly required.

Avoid creating:
- Category model
- City model
- Genre model
- Language model

Use schema structure defined inside `ProjectSRS.md`.

---

# Architecture Stability Rule

Do not introduce:
- Redux
- Zustand
- Prisma
- Drizzle
- GraphQL
- Microservices
- tRPC
- Complex caching systems

unless explicitly required inside `ProjectPlan.md`.

---

# File Creation Rules

Before creating new files:

1. Check if similar functionality already exists.
2. Check `ProjectTree.md`.
3. Prefer extending existing systems instead of duplicating logic.
4. Avoid unnecessary wrappers and abstractions.

---

# Refactor Rules

Do not perform large refactors unless:
- required for maintainability
- required for scalability
- required for architecture consistency
- explicitly planned in `ProjectPlan.md`

Avoid changing stable APIs unnecessarily.

---

# UI Rules

- Match `ProjectDemo.html` as closely as possible.
- Maintain spacing consistency.
- Maintain responsive behavior.
- Avoid inconsistent component styling.
- Avoid random design systems.
- Keep animations subtle and lightweight.
- Prefer clean layouts over visually heavy sections.

---

# Performance Rules

- Prefer server components where appropriate.
- Avoid unnecessary client components.
- Avoid unnecessary re-renders.
- Optimize image loading.
- Keep bundle size reasonable.
- Use ISR and caching strategies defined in the SRS.

---

# SEO Rules

Follow metadata strategy defined in `ProjectSRS.md`.

Public pages should maintain:
- proper metadata
- canonical URLs
- OpenGraph support
- clean routing structure

---

# Import Rules

Prefer:
- absolute imports
- modular imports
- predictable folder paths

Avoid:
- deeply nested relative imports
- circular dependencies

---

# Final Rule

This project may be edited over long periods of time by different AI systems and contributors.

Always prioritize:
- consistency
- maintainability
- predictability
- scalability
- low complexity
- low token usage
- minimal confusion for future agents