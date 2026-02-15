# EPIC 11 — Full Visual Refresh Guidelines

Light-First Expressive Marketplace Aesthetic

This document defines implementation rules, guardrails, visual system constraints,
and PR review standards for EPIC 11. Codex must follow these guidelines strictly.

---

## 1. Routing Structure

- Preserve existing `/app` protected route structure.
- Create a new public `/` landing route with full marketing layout.
- `/` = marketing surface
- `/app` = authenticated workspace
- Do not break authentication logic.
- Do not regress protected route behavior.

---

## 2. Design System First (Mandatory Before Screens)

Before implementing new layouts:

### 2.1 Extend Design Tokens (globals.css @theme)

- Light base background
- White surface
- Subtle border color
- Expressive primary gradient (purple → blue)
- Controlled accent color (cyan or pink, minimal usage)
- Shadow scale (sm / md only)
- Single radius scale (rounded-xl or equivalent)

### 2.2 Utility Classes To Add

- `.bg-hero-gradient`
- `.btn-primary-gradient`
- `.surface-elevated`
- `.ring-accent`

No arbitrary Tailwind colors allowed outside tokens.

---

## 3. Gradient Usage Rules

Gradients are allowed ONLY in:

- Hero background
- Primary CTA buttons
- AI progress animation
- Subtle hover overlays (low opacity)

Gradients must NOT be:

- Applied to all cards
- Used randomly across surfaces
- Mixed with multiple unrelated gradient styles

Consistency over decoration.

---

## 4. Typography & Hierarchy

- Hero heading: large, bold, confident.
- Clear visual scale: H1 > H2 > Body > Caption.
- Buttons clearly differentiated:
  - Primary (gradient)
  - Secondary (solid surface)
  - Ghost (minimal)

No inconsistent font sizing between screens.

---

## 5. Landing Page Requirements (/)

Hero must include:

- Bold 2-line headline
- Gradient-highlighted word
- Product preview mock panel
- Primary CTA → Signup
- Secondary CTA → Login

Layout must feel like marketing page, not a centered white card.

Sections:

- Hero
- How It Works (3 steps)
- Example Listing Preview
- CTA section

Spacing must feel breathable and structured.

---

## 6. Dashboard Layout Restructure (/app)

Desktop:

- Two-column layout
  Left: Upload + controls
  Right: Result panel

Mobile:

- Stacked with strong hierarchy

Include:

- Styled segmented toggle (Image / Text)
- Clear primary action button
- “Recent Listings” section

Do not keep MVP vertical form stack.

---

## 7. Image Dropzone Requirements

- Large dropzone area
- Dashed animated border
- Centered icon + instruction text
- Drag-over active styling
- Click-to-upload works
- Preview displayed after upload
- Remove/reset animation
- Keyboard accessible

No basic `<input type="file">` appearance.

---

## 8. AI Progress Experience (No Spinner Allowed)

Replace spinner with:

- Progress ring animation
- Step list with states:
  - Analyzing image
  - Crafting title & description
  - Optimizing listing
- Minimum visible duration (avoid flicker)
- Smooth transition to result
- Subtle gradient shimmer or accent

Perceived performance must feel intentional.

---

## 9. Listing Cards (V2)

Each card must include:

- 16:9 thumbnail
- Title
- Status pill (READY / DRAFT)
- Price range if available
- Hover elevation
- Low-opacity gradient hover overlay
- Image skeleton loader

Grid must be responsive.

Cards should feel like marketplace inventory.

---

## 10. Listing Detail Page Upgrade

- Image header/gallery section
- Price range panel styled as distinct surface
- Editable fields visually structured
- Primary action (Save) emphasized
- Secondary actions (Copy / Regenerate) styled consistently
- Consistent spacing and surface elevation

Must feel like final output preview, not form editor.

---

## 11. Motion & Interaction Rules

Allowed:

- Subtle hover elevation
- Fade-in transitions
- Gradient shimmer
- Step progression animation

Not allowed:

- Bounce effects
- Excessive scaling
- Flashing elements
- Over-animation

Motion must enhance clarity, not distract.

---

## 12. Performance Rules

- Use skeleton loaders for images.
- Avoid layout shifts.
- Do not block rendering while waiting for images.
- Keep animation performant (no heavy reflows).

---

## 13. Accessibility Requirements

- Focus states on all buttons and inputs.
- Keyboard operable dropzone.
- Proper alt text for images.
- Maintain readable contrast on gradients.

---

## 14. Implementation Order (Strict)

1. Extend design tokens + update base components.
2. Implement Landing Page.
3. Implement ImageDropzone.
4. Restructure Dashboard layout.
5. Implement AI Progress Experience.
6. Upgrade Listing Cards.
7. Upgrade Listing Detail page.

Do NOT mix multiple features in one PR.

---

# Pull Request Standards for EPIC 11

Each feature must be implemented in a separate PR.

Each PR must include:

- Clear title:
  Example: feat(ui): implement expressive hero landing page
- Description explaining:
  - What was changed
  - Why it aligns with EPIC 11
  - Screens affected
- Screenshots (before/after if possible)
- No unrelated refactors
- No new arbitrary color classes
- No mixed radius sizes

---

# Commit Naming Convention

Use conventional commits:

feat(ui): implement hero section with gradient background
feat(ui): add ImageDropzone component
feat(ui): restructure dashboard layout
feat(ui): implement generating overlay
feat(ui): upgrade listing cards to image-first layout
refactor(ui): normalize button and card design tokens

Do NOT use generic commit messages like:

- update styles
- fix layout
- tweak design

---

# General Principle

This EPIC upgrades the product from MVP to portfolio-grade SaaS.

Every change must:

- Improve hierarchy
- Improve perceived performance
- Improve consistency
- Improve product positioning

If unsure:
Favor clarity and consistency over decoration.

End of document.
