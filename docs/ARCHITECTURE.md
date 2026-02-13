# Architecture - ListingCopilot

This document defines the technical architecture for the MVP of ListingCopilot.

It follows:

- PRD.md
- UX.md
- DATA_MODEL.md
- PRODUCT_DEVELOPMENT_SYSTEM.md

This is the single source of truth for engineering decisions in MVP.

---

# 1. Tech Stack

## Frontend

- React + Vite
- TypeScript
- TailwindCSS v4 (CSS-first configuration, no tailwind.config.js)
- React Router
- TanStack Query (server state management)
- React Hook Form
- Zod (validation & contract safety)
- Supabase JS client (Auth, Database, Storage)

## Backend (MVP)

Recommended:

- Supabase Edge Function (secure Gemini calls, minimal infrastructure)

Alternative:

- Minimal Node/Express server (if infrastructure control is required)

## Testing

- Vitest + React Testing Library (unit/integration)
- Playwright (optional MVP smoke E2E)

---

# 2. TailwindCSS v4 Setup (Important)

Tailwind CSS v4 removes `tailwind.config.js`.

Configuration is done directly inside CSS using:

- `@import`
- `@theme`

Example (`src/styles/globals.css`):

@import "tailwindcss";

@theme {
--color-primary: #2563eb;
--radius-lg: 1rem;
}

Key Differences vs v3:

- No tailwind.config.js
- No content array
- No JS-based theme extension
- CSS-first configuration model
- Design tokens defined directly in CSS
- Cleaner and simpler DX

Design tokens must live in:

/src/styles/globals.css

Do not create a legacy config file.

---

# 3. Folder Structure

Feature-first architecture (hireable, scalable, not over-engineered):

/docs
PRD.md
UX.md
DATA_MODEL.md
ARCHITECTURE.md

/src
/app
App.tsx
router.tsx
providers.tsx

/components
/ui
Button.tsx
Input.tsx
Card.tsx
Badge.tsx
Skeleton.tsx
Toast.tsx
/layout
PublicLayout.tsx
AppLayout.tsx

/features
/auth
api.ts
routes.tsx
schemas.ts
components/

    /listings
      api.ts
      routes.tsx
      schemas.ts
      types.ts
      hooks/
      components/

/lib
supabaseClient.ts
env.ts
utils.ts

/styles
globals.css

main.tsx

/supabase
/functions
generate-listing/
index.ts
prompt.ts

Rules:

- /features contains domain logic.
- /components/ui contains reusable primitives only.
- Avoid dumping business logic in /lib.

---

# 4. Routing Strategy

## Public Routes

- /
- /login
- /signup

## Protected Routes

- /app
- /app/listings/:id

Implementation:

- PublicLayout
- AppLayout
- AuthGuard

Redirect Rules:

- Authenticated user hitting /login → redirect to /app
- Unauthenticated user hitting /app/\* → redirect to /login?returnTo=...

---

# 5. State Strategy

## Global State

- Auth session
- User object

Managed via:

- AuthProvider
- Supabase auth listener

## Server State (TanStack Query)

Query keys:

- ['listings']
- ['listings', id]

Mutations:

- generateListing
- saveListing
- deleteListing (optional MVP)

## Local UI State

- inputMode: "image" | "text"
- selectedFile
- draftListing (generated result before save)
- loading flags
- validation errors

Draft remains local until user saves.

---

# 6. Database Strategy

Table: listings

Columns:

- id
- user_id
- title
- description
- bullet_points (JSONB)
- price_min
- price_max
- status
- created_at

Security:

- Row Level Security enabled
- Policy: user_id = auth.uid()

Frontend must never trust or manually set user_id.

---

# 7. Storage Strategy

Supabase Storage bucket:

- listing-inputs

Flow:

1. Upload image
2. Get public URL
3. Send URL to AI backend
4. Save URL in listing record (optional MVP)

Avoid storing base64 data in React state.

---

# 8. AI Generation Endpoint

Frontend must call your backend (never Gemini directly).

Request:

{
"mode": "image" | "text",
"imageUrl": "string (required for image mode)",
"text": "string (required for text mode)"
}

Response:

{
"draft": {
"title": "string",
"description": "string",
"bullet_points": ["string"],
"price_min": 0,
"price_max": 0
}
}

Validation:

- Backend must validate response using Zod
- Frontend must defensively parse response using Zod

Never trust raw LLM output.

---

# 9. Form Strategy

## Auth Forms

- React Hook Form
- Zod schemas
- Inline validation
- Real password rule enforcement

## Listing Generator

Validation:

- Image required if image mode
- Text required if text mode

Preview fields:

- Editable locally
- Validated on Save

---

# 10. Error Handling Strategy

Auth:

- Inline form errors

Generate:

- Error banner
- Retry option
- Preserve draft inputs
- Normalize provider quota/rate-limit errors to stable backend codes and user-friendly messages

Save:

- Retry without losing preview

Query errors:

- Skeleton → error state → retry button

Session expiry:

- Redirect to login with returnTo parameter

---

# 11. Reusability Plan

## UI Primitives

- Button
- Input
- Textarea
- Card
- Badge
- Toast
- Skeleton

UI components must not contain business logic.

## Domain Components

- ListingPreview
- ListingCard
- SavedListingsPanel

Domain components may use hooks and business logic.

---

# 12. Performance Considerations

- Use TanStack Query caching properly
- Avoid unnecessary refetch
- Upload images before generation
- Avoid premature memoization
- No virtualization for MVP

Keep MVP simple and stable.

---

# 13. Testing Strategy

Required for MVP:

- AuthGuard behavior
- ListingGenerator validation logic
- API response parsing (Zod contract)
- Save listing mutation updates list correctly

Optional:

- E2E smoke:
  - Login
  - Generate listing
  - Save listing
  - View listing detail

---

# 14. Environment Variables

Frontend (.env):

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_API_BASE_URL

Backend:

- GEMINI_API_KEY
- GEMINI_MODEL (optional, recommended)

Never commit environment files.

---

# 15. MVP Non-Goals

Not included in MVP:

- Marketplace publishing
- Scraping or live price aggregation
- Bulk upload
- Payments or subscriptions
- Version history
- Multi-language support
