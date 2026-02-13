# UX / System Design - ListingCopilot

Inputs:

- PRD.md
- MVP_SCOPE.md

Assumptions (MVP):

- Supabase (Auth + Postgres + Storage)
- Frontend calls our backend endpoint for AI generation (proxy to Gemini)
- Listings stored per authenticated user in DB

---

## User Journeys

### Journey 1 — First-Time User Generates a Listing (Happy Path)

1. User lands on Home page
2. Clicks “Get Started”
3. Signs up (email + password)
4. Redirected to Dashboard (protected)
5. Chooses input method:
   - Upload image OR
   - Enter product name
6. Clicks “Generate Listing”
7. Loading state appears with progress feedback
8. AI returns structured listing:
   - Title
   - Description
   - Bullet points
   - Suggested price range
9. User reviews and optionally edits content
10. Clicks “Save”
11. Success toast appears
12. Listing appears in Saved Listings panel

---

### Journey 2 — Returning User Views Saved Listings

1. User logs in
2. Redirected to Dashboard
3. Saved Listings list is fetched
4. User clicks a listing card
5. Navigates to Listing Detail page

---

### Journey 3 — Copy Listing

1. User opens generated listing or saved listing
2. Clicks “Copy Listing”
3. Formatted content copied to clipboard
4. Confirmation toast appears

---

### Journey 4 — Failure Scenarios

- Invalid image upload → Inline error
- Empty input submission → Inline validation
- AI failure → Error banner + Retry button
- AI quota/rate limit → Friendly message ("AI provider quota exceeded. Please try again later.")
- Save failure → Keep preview visible + Retry
- Session expired → Redirect to Login with return URL
- Listing not found → Friendly 404 state

---

## Route Map

### Public Routes

- `/` — Home
- `/login`
- `/signup`

### Protected Routes

- `/app` — Dashboard
- `/app/listings/:id` — Listing Detail
- `/app/account` (optional MVP)

### Redirect Rules

- Authenticated users visiting `/login` or `/signup` → Redirect to `/app`
- Unauthenticated users visiting `/app/*` → Redirect to `/login?returnTo=...`

---

## Page Definitions

### 1) Home (`/`)

- Value proposition
- Primary CTA → Signup
- Secondary CTA → Login

---

### 2) Signup (`/signup`)

Fields:

- Email
- Password
- Confirm Password

States:

- Loading
- Error
- Redirect on success

---

### 3) Login (`/login`)

Fields:

- Email
- Password

States:

- Loading
- Invalid credentials
- Redirect on success

---

### 4) Dashboard (`/app`)

Layout:

- Generator section
- Saved Listings section

Generator:

- Input mode toggle (Image / Text)
- Image uploader OR text input
- Generate button
- Preview panel after generation
- Actions: Save, Copy, Reset

Saved Listings:

- List of cards
- Metadata preview
- Empty state message

---

### 5) Listing Detail (`/app/listings/:id`)

Content:

- Title
- Bullets
- Description
- Price range
- Metadata (date, input type)

Actions:

- Copy
- Back
- (Optional) Delete

States:

- Loading skeleton
- Error state
- Not found state

---

## Component Hierarchy

### App Layout

- AppLayout
  - TopNav
  - MainContainer
    - Outlet

### Auth

- SignupForm
- LoginForm
- FormField
- PasswordField

### Dashboard

- DashboardPage
  - ListingGenerator
    - InputModeToggle
    - ImageUploader
    - TextInput
    - GenerateButton
    - GenerationStatus
    - ListingPreview
      - EditableTitle
      - EditableBullets
      - EditableDescription
      - PriceRangeDisplay
      - PreviewActions
  - SavedListingsPanel
    - ListingsList
      - ListingCard

### Listing Detail

- ListingDetailPage
  - ListingHeader
  - ListingContent
  - ListingActions

### Shared Components

- Button
- IconButton
- Card
- Skeleton
- ToastProvider
- ErrorBanner
- EmptyState

---

## State Ownership Strategy

### Global State

- Auth session (via Supabase)
- User object

### Server State (recommended: TanStack Query)

- Fetch listings
- Fetch single listing
- Save listing mutation
- Delete listing mutation

### Local UI State

- Input mode
- Image file
- Product name
- Generated draft
- isGenerating
- isSaving
- Error states

Rule:
Generated draft stays local until saved.

---

## Error & Loading States

Auth:

- Inline validation
- Disabled submit during request

Generation:

- Disable inputs during loading
- Show progress indicator
- Preserve inputs on failure

Save:

- Disable Save while saving
- Preserve preview on failure

Listings list:

- Skeleton loading
- Empty state
- Retry option on error

Listing detail:

- Skeleton
- Not found state
- Retry button

---

## Accessibility Baseline

- All inputs have associated labels
- aria-live for status messages
- Keyboard operable upload
- Focus management on errors
- Proper heading hierarchy
- WCAG AA contrast compliance

---

## Responsive Strategy

Mobile-first approach.

Mobile:

- Vertical stacking
- Full-width cards

Desktop:

- Two-column layout on Dashboard
- Generator left, Listings right

Buttons:

- Stacked on mobile
- Inline on desktop
