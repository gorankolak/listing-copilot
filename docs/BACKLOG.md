# Backlog — ListingCopilot (MVP)

---

## EPIC 1 — Project Foundation

### Feature: Vite + Tailwind v4 Setup

- [x] Initialize Vite + React + TypeScript project
- [x] Install TailwindCSS v4 and configure via `globals.css` using `@import "tailwindcss";`
- [x] Define design tokens inside `globals.css` using `@theme`
- [x] Configure base layout styles and container system
- [x] Install and configure ESLint + Prettier
- [x] Create folder structure per ARCHITECTURE.md
- [x] Add `/docs` folder and copy all phase documents

---

### Feature: Core Dependencies

- [x] Install React Router
- [x] Install TanStack Query
- [x] Install React Hook Form
- [x] Install Zod
- [x] Install Supabase JS client
- [x] Setup `supabaseClient.ts`
- [x] Setup `env.ts` and environment variable validation

---

## EPIC 2 — App Shell & Routing

### Feature: App Providers

- [x] Implement `AuthProvider` with Supabase session listener
- [x] Implement `QueryClientProvider`
- [x] Create `providers.tsx`
- [x] Wrap providers in `main.tsx`

---

### Feature: Routing Structure

- [x] Configure `router.tsx` with public and protected routes
- [x] Implement `AuthGuard`
- [x] Implement redirect logic with `returnTo`
- [x] Create `PublicLayout`
- [x] Create `AppLayout` with top navigation
- [x] Verify route access behavior (manual test)

---

## EPIC 3 — Authentication

### Feature: Signup

- [x] Create `SignupForm` using React Hook Form
- [x] Implement Zod validation schema
- [x] Connect to Supabase `signUp`
- [x] Add loading + inline error handling
- [x] Redirect to `/app` on success

---

### Feature: Login

- [x] Create `LoginForm`
- [x] Implement Zod validation
- [x] Connect to Supabase `signInWithPassword`
- [x] Handle invalid credentials
- [x] Redirect authenticated users away from `/login`

---

### Feature: Logout

- [x] Add logout button in `AppLayout`
- [x] Implement Supabase `signOut`
- [x] Ensure session clears correctly

---

## EPIC 4 — UI Primitives (Reusable)

### Feature: Base Components

- [x] Implement `Button`
- [x] Implement `Input`
- [x] Implement `Textarea`
- [x] Implement `Card`
- [x] Implement `Badge`
- [x] Implement `Skeleton`
- [x] Implement `Toast` system
- [x] Implement `ErrorBanner`
- [x] Implement `EmptyState`

All must:

- Support accessibility
- Be logic-free (UI only)

---

## EPIC 5 — Listing Generator

### Feature: Generator UI Structure

- [x] Create `ListingGenerator` component
- [x] Implement input mode toggle (image/text)
- [x] Implement `ImageUploader` with file validation
- [x] Implement text input mode
- [x] Disable invalid submission states

---

### Feature: Supabase Storage Upload

- [x] Create storage bucket `listing-inputs`
- [x] Implement image upload function
- [x] Return public URL after upload
- [x] Handle upload errors
- [x] Ensure no base64 stored in React state

---

### Feature: AI Generation API Integration

- [x] Create `/supabase/functions/generate-listing`
- [x] Implement Gemini proxy logic
- [x] Implement backend Zod response validation
- [x] Define strict JSON contract
- [x] Handle AI error scenarios
- [x] Return structured response

---

### Feature: Frontend Generation Flow

- [x] Create TanStack mutation `generateListing`
- [x] Show loading state with disabled inputs
- [x] Parse response using frontend Zod schema
- [x] Store generated draft locally
- [x] Implement error banner + retry
- [x] Preserve user inputs on failure

---

## EPIC 6 — Listing Preview

### Feature: Preview Component

- [x] Implement `ListingPreview`
- [x] Editable title field
- [x] Editable bullets list
- [x] Editable description
- [x] Price range display
- [x] Reset button clears draft

---

### Feature: Copy to Clipboard

- [x] Implement formatted listing builder function
- [x] Use `navigator.clipboard.writeText`
- [x] Show confirmation toast
- [x] Handle clipboard failure fallback

---

## EPIC 7 — Persistence (CRUD)

### Feature: Save Listing

- [ ] Create `saveListing` mutation
- [ ] Map preview data to DB schema
- [ ] Insert record into Supabase
- [ ] Invalidate `['listings']` query
- [ ] Disable save while saving
- [ ] Preserve preview on failure

---

### Feature: Fetch Listings (Dashboard Panel)

- [ ] Create `useListingsQuery`
- [ ] Implement loading skeleton
- [ ] Implement empty state
- [ ] Render `ListingCard`
- [ ] Handle query error with retry

---

### Feature: Listing Detail Page

- [ ] Create `useListingQuery`
- [ ] Implement route `/app/listings/:id`
- [ ] Show skeleton while loading
- [ ] Handle 404 state
- [ ] Render full listing detail
- [ ] Add copy action

---

### Feature: Delete Listing (Optional MVP)

- [ ] Implement delete mutation
- [ ] Confirm deletion dialog
- [ ] Invalidate listings query
- [ ] Redirect to dashboard after delete

---

## EPIC 8 — State & Edge Cases

### Feature: Session Expiry Handling

- [ ] Detect session invalidation
- [ ] Redirect to login with `returnTo`
- [ ] Preserve unsaved draft in memory

---

### Feature: Form Validation Edge Cases

- [ ] Enforce image required in image mode
- [ ] Enforce text required in text mode
- [ ] Prevent double submission
- [ ] Handle extremely vague input gracefully

---

## EPIC 9 — Accessibility & UX Polish

### Feature: Accessibility Compliance

- [ ] Associate labels with all inputs
- [ ] Add `aria-live` for generation status
- [ ] Manage focus on errors
- [ ] Ensure keyboard operability
- [ ] Validate heading hierarchy
- [ ] Verify WCAG AA contrast

---

### Feature: Responsive Layout

- [ ] Implement mobile-first layout
- [ ] Stack generator + listings on mobile
- [ ] Two-column layout on desktop
- [ ] Ensure buttons stack properly

---

## EPIC 10 — Testing

### Feature: Unit & Integration

- [ ] Setup Vitest
- [ ] Test AuthGuard behavior
- [ ] Test generator validation logic
- [ ] Test Zod parsing of AI response
- [ ] Test save mutation updates list cache

---

### Feature: Optional E2E (Smoke)

- [ ] Setup Playwright
- [ ] Test login flow
- [ ] Test generate → save → view listing

---

# Priority Execution Order (Critical Path)

1. Foundation
2. Routing + Auth
3. Generator + AI integration
4. Save + Fetch listings
5. Listing detail
6. Edge cases
7. A11y polish
8. Testing
