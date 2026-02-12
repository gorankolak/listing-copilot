# Data Model - ListingCopilot

Assumption:

- Supabase (Auth + Postgres + Storage)

---

## Entities

### User

Managed by Supabase Auth.
Referenced by user_id (UUID).

---

### Listing

Fields:

- id: UUID
- user_id: UUID (FK → auth.users.id)
- input_type: "image" | "text"
- input_text: string | null
- image_url: string | null
- title: string
- description: string
- bullets: string[] (jsonb)
- price_min: number | null
- price_max: number | null
- currency: string
- created_at: timestamp
- updated_at: timestamp

---

## Relationships

- User (1) → (N) Listings

---

## Example AI Response (Backend → Frontend)

{
"title": "Vintage IKEA Desk Lamp (Great Condition)",
"description": "Minimalist IKEA desk lamp with adjustable arm.",
"bullets": [
"Adjustable arm",
"Works perfectly",
"Lightweight",
"Ideal for desk"
],
"priceRange": {
"min": 15,
"max": 25,
"currency": "EUR"
}
}

---

## Example Listing Record (Database)

{
"id": "uuid",
"user_id": "uuid",
"input_type": "image",
"input_text": null,
"image_url": "https://storage-url/lamp.jpg",
"title": "Vintage IKEA Desk Lamp (Great Condition)",
"description": "Minimalist IKEA desk lamp with adjustable arm.",
"bullets": [
"Adjustable arm",
"Works perfectly",
"Lightweight",
"Ideal for desk"
],
"price_min": 15,
"price_max": 25,
"currency": "EUR",
"created_at": "2026-02-12T12:10:00Z",
"updated_at": "2026-02-12T12:10:00Z"
}

---

## MVP Constraints

- Bullets stored as jsonb array
- Price stored as min/max
- No analytics fields
- No prompt history stored
- No multi-language support
- No versioning
