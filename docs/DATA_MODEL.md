# Data Model - ListingCopilot

Assumption:

- Supabase (Auth + Postgres + Storage)

---

## Entities

### User

Managed by Supabase Auth.
Referenced by `user_id` (UUID).

---

### Listing

Fields:

- id: UUID
- user_id: UUID (FK -> auth.users.id)
- input_mode: "image" | "text"
- input_text: string | null
- input_image_url: string | null
- title: string
- description: string
- bullet_points: string[] (jsonb)
- price_min: number | null
- price_max: number | null
- created_at: timestamp
- updated_at: timestamp

---

## Relationships

- User (1) -> (N) Listings

---

## API Contract (Generation)

Request (Frontend -> Backend):

- `{"mode":"image","imageUrl":"https://..."}`
- `{"mode":"text","text":"Product details..."}`

Response (Backend -> Frontend):

- `{"draft":{"title":"...","description":"...","bullet_points":["..."],"price_min":0,"price_max":0}}`

---

## Example Listing Record (Database)

{
"id": "uuid",
"user_id": "uuid",
"input_mode": "image",
"input_text": null,
"input_image_url": "https://storage-url/lamp.jpg",
"title": "Vintage IKEA Desk Lamp (Great Condition)",
"description": "Minimalist IKEA desk lamp with adjustable arm.",
"bullet_points": [
"Adjustable arm",
"Works perfectly",
"Lightweight",
"Ideal for desk"
],
"price_min": 15,
"price_max": 25,
"created_at": "2026-02-12T12:10:00Z",
"updated_at": "2026-02-12T12:10:00Z"
}

---

## MVP Constraints

- Bullet points stored as jsonb array
- Price stored as min/max
- Currency is implicit USD for MVP
- No analytics fields
- No prompt history stored
- No multi-language support
- No versioning
