# Backlog — ListingCopilot (MVP)

---

## EPIC 1 — Project Foundation

### Feature: Vite + Tailwind v4 Setup

- [ ] Initialize Vite + React + TypeScript project
- [ ] Install TailwindCSS v4 and configure via `globals.css` using `@import "tailwindcss";`
- [ ] Define design tokens inside `globals.css` using `@theme`
- [ ] Configure base layout styles and container system
- [ ] Install and configure ESLint + Prettier
- [ ] Create folder structure per ARCHITECTURE.md
- [ ] Add `/docs` folder and copy all phase documents

---

### Feature: Core Dependencies

- [ ] Install React Router
- [ ] Install TanStack Query
- [ ] Install React Hook Form
- [ ] Install Zod
- [ ] Install Supabase JS client
- [ ] Setup `supabaseClient.ts`
- [ ] Setup `env.ts` and environment variable validation

---

## EPIC 2 — App Shell & Routing

### Feature: App Providers

- [ ] Implement `AuthProvider` with Supabase session listener
- [ ] Implement `QueryClientProvider`
- [ ] Create `providers.tsx`
- [ ] Wrap providers in `main.tsx`

---

### Feature: Routing Structure

- [ ] Configure `router.tsx` with public and protected routes
- [ ] Implement `AuthGuard`
- [ ] Implement redirect logic with `returnTo`
- [ ] Create `PublicLayout`
- [ ] Create `AppLayout` with top navigation
- [ ] Verify route access behavior (manual test)

---

## EPIC 3 — Authentication

### Feature: Signup

- [ ] Create `SignupForm` using React Hook Form
- [ ] Implement Zod validation schema
- [ ] Connect to Supabase `signUp`
- [ ] Add loading + inline error handling
- [ ] Redirect to `/app` on success

---

### Feature: Login

- [ ] Create `LoginForm`
- [ ] Implement Zod validation
- [ ] Connect to Supabase `signInWithPassword`
- [ ] Handle invalid credentials
- [ ] Redirect authenticated users away from `/login`

---

### Feature: Logout

- [ ] Add logout button in `AppLayout`
- [ ] Implement Supabase `signOut`
- [ ] Ensure session clears correctly

---

## EPIC 4 — UI Primitives (Reusable)

### Feature: Base Components

- [ ] Implement `Button`
- [ ] Implement `Input`
- [ ] Implement `Textarea`
- [ ] Implement `Card`
- [ ] Implement `Badge`
- [ ] Implement `Skeleton`
- [ ] Implement `Toast` system
- [ ] Implement `ErrorBanner`
- [ ] Implement `EmptyState`

All must:

- Support accessibility
- Be logic-free (UI only)

---

## EPIC 5 — Listing Generator

### Feature: Generator UI Structure

- [ ] Create `ListingGenerator` component
- [ ] Implement input mode toggle (image/text)
- [ ] Implement `ImageUploader` with file validation
- [ ] Implement text input mode
- [ ] Disable invalid submission states

---

### Feature: Supabase Storage Upload

- [ ] Create storage bucket `listing-inputs`
- [ ] Implement image upload function
- [ ] Return public URL after upload
- [ ] Handle upload errors
- [ ] Ensure no base64 stored in React state

---

### Feature: AI Generation API Integration

- [ ] Create `/supabase/functions/generate-listing`
- [ ] Implement OpenAI proxy logic
- [ ] Implement backend Zod response validation
- [ ] Define strict JSON contract
- [ ] Handle AI error scenarios
- [ ] Return structured response

---

### Feature: Frontend Generation Flow

- [ ] Create TanStack mutation `generateListing`
- [ ] Show loading state with disabled inputs
- [ ] Parse response using frontend Zod schema
- [ ] Store generated draft locally
- [ ] Implement error banner + retry
- [ ] Preserve user inputs on failure

---

## EPIC 6 — Listing Preview

### Feature: Preview Component

- [ ] Implement `ListingPreview`
- [ ] Editable title field
- [ ] Editable bullets list
- [ ] Editable description
- [ ] Price range display
- [ ] Reset button clears draft

---

### Feature: Copy to Clipboard

- [ ] Implement formatted listing builder function
- [ ] Use `navigator.clipboard.writeText`
- [ ] Show confirmation toast
- [ ] Handle clipboard failure fallback

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

