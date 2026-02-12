# Product Requirements Document - ListingCopilot

## Problem Statement

Casual sellers who want to declutter their homes waste significant time researching prices and writing marketplace listings. The manual process of checking similar items, estimating value, and crafting descriptions creates friction that delays or prevents them from selling altogether.

The result:

- Procrastination
- Underpricing
- Abandoned listings
- Time loss

The dominant pain driver is time waste, followed by pricing uncertainty and mental friction.

---

## Target Audience

Primary Persona: Casual Declutterer

Profile:

- Selling 5–20 items occasionally
- Not a professional reseller
- Uses platforms like eBay or similar marketplaces
- Wants fast, simple listing creation
- Low tolerance for research and formatting work

---

## Value Proposition

Turn any item into a ready-to-publish marketplace listing in under 60 seconds — including title, description, bullet points, and suggested price range.

Stop researching. Upload a photo or enter a product name and get an AI-generated listing instantly.

---

## MVP Scope

Included:

- User authentication (signup, login, logout)
- Protected dashboard
- Image upload OR text input
- AI generation of:
  - Listing title
  - Description
  - Bullet points
  - Suggested price range
- Loading and error states
- Save listing to user account
- View saved listings
- Copy-to-clipboard functionality

---

## Out of Scope

- Real marketplace API publishing
- Multi-platform posting
- Scraping or live price aggregation
- Advanced analytics
- Bulk upload
- Price history tracking
- Multi-language support
- Payments or subscriptions
- Mobile native app

---

## Core User Flows

### Flow 1: Generate Listing

1. User logs in
2. User navigates to dashboard
3. User uploads image OR enters product name
4. Clicks "Generate Listing"
5. Loading state shown
6. AI returns structured listing data
7. Listing is displayed
8. User saves listing

---

### Flow 2: View Saved Listings

1. User logs in
2. User navigates to dashboard
3. User sees list of previously generated listings
4. User clicks one to view details

---

### Flow 3: Copy Listing

1. User opens generated listing
2. Clicks “Copy Listing”
3. Content copied to clipboard

---

## User Stories

- As a casual seller, I want to upload a photo so I don’t have to type everything.
- As a user, I want a suggested price range so I don’t underprice.
- As a user, I want the listing written for me to save time.
- As a user, I want to save listings so I can post them later.
- As a user, I want a simple interface with minimal friction.

---

## Edge Cases

- Invalid image upload
- AI response failure
- Network error
- User not authenticated
- Empty input submission
- Extremely vague product name
- Slow AI response
- Duplicate saved listings

---

## Success Metrics

Product Success:

- User can go from image → saved listing in under 60 seconds
- AI response under 10 seconds
- No blocking UX friction
- Auth flows operate correctly
- Listings persist per user

Portfolio Success:

- Demonstrates:
  - Authentication
  - Protected routes
  - File upload handling
  - Async AI integration
  - CRUD operations
  - Structured state management
  - Clean loading and error handling
