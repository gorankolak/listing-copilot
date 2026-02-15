import { Link } from 'react-router-dom'

import { buttonClassName } from '../../../components/ui/Button'
import { Card, CardDescription, CardTitle } from '../../../components/ui/Card'

export function HomePage() {
  return (
    <div className="space-y-10 md:space-y-14">
      <section className="grid grid-cols-1 gap-6 md:gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
        <div>
          <p className="mb-4 inline-flex items-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-1 text-xs font-medium tracking-wide text-[color:var(--color-text-muted)]">
            Marketplace-ready listings in minutes
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-[color:var(--color-text)] md:text-6xl">
            Turn rough product ideas into
            <span className="ml-2 bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
              listing-ready copy
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-[color:var(--color-text-muted)] md:text-lg">
            ListingCopilot generates optimized titles, bullet points, and pricing guidance so you can
            launch faster across your marketplace channels.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/signup" className={buttonClassName({ variant: 'primary', size: 'lg' })}>
              Start Free
            </Link>
            <Link to="/login" className={buttonClassName({ variant: 'secondary', size: 'lg' })}>
              Login
            </Link>
          </div>
        </div>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-24 bg-[image:var(--gradient-primary)] opacity-15" />
          <div className="relative space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[color:var(--color-text)]">Product Preview</p>
              <span className="rounded-full bg-[color:var(--color-surface-muted)] px-3 py-1 text-xs font-medium text-[color:var(--color-text-muted)]">
                Auto-generated
              </span>
            </div>
            <div className="surface-elevated p-4">
              <p className="text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">Title</p>
              <p className="mt-2 text-sm font-semibold text-[color:var(--color-text)]">
                Wireless Noise-Cancelling Headphones with 40H Battery and USB-C Fast Charge
              </p>
            </div>
            <div className="surface-elevated p-4">
              <p className="text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">Bullets</p>
              <ul className="mt-2 space-y-1 text-sm text-[color:var(--color-text-muted)]">
                <li>Adaptive ANC for commute, work, and travel.</li>
                <li>Lightweight frame with fold-flat storage.</li>
                <li>Suggested price range: $89 - $109.</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardTitle>1. Add your product input</CardTitle>
          <CardDescription>
            Upload a photo or paste rough product text and key features.
          </CardDescription>
        </Card>
        <Card>
          <CardTitle>2. Generate optimized copy</CardTitle>
          <CardDescription>
            AI drafts marketplace-friendly titles, bullets, and pricing guidance.
          </CardDescription>
        </Card>
        <Card>
          <CardTitle>3. Review and launch</CardTitle>
          <CardDescription>
            Edit details, copy the final listing, and publish with confidence.
          </CardDescription>
        </Card>
      </section>

      <section className="surface-elevated p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text)] md:text-3xl">
          Example listing output
        </h2>
        <p className="mt-2 text-sm text-[color:var(--color-text-muted)] md:text-base">
          Preview how generated copy appears before saving to your workspace.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="surface-elevated bg-[color:var(--color-surface-muted)] p-4">
            <p className="text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">Title</p>
            <p className="mt-2 text-sm font-medium text-[color:var(--color-text)]">
              Handcrafted Ceramic Coffee Mug, 14 oz, Dishwasher-Safe, Speckled Clay Finish
            </p>
          </div>
          <div className="surface-elevated bg-[color:var(--color-surface-muted)] p-4">
            <p className="text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">Price Guidance</p>
            <p className="mt-2 text-sm font-medium text-[color:var(--color-text)]">$24 - $29</p>
          </div>
        </div>
      </section>

      <section className="surface-elevated bg-[image:var(--gradient-primary)] p-8 text-white">
        <h2 className="text-2xl font-semibold md:text-3xl">Ready to accelerate your listings?</h2>
        <p className="mt-2 max-w-2xl text-sm text-white/90 md:text-base">
          Join ListingCopilot and move from draft notes to polished marketplace copy faster.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/signup"
            className={buttonClassName({
              variant: 'secondary',
              className:
                'border-white/40 bg-white/95 text-[color:var(--color-text)] hover:bg-white',
            })}
          >
            Create Account
          </Link>
          <Link
            to="/login"
            className={buttonClassName({
              variant: 'ghost',
              className:
                'border border-white/40 text-white hover:bg-white/10 focus-visible:ring-white/50',
            })}
          >
            Sign In
          </Link>
        </div>
      </section>
    </div>
  )
}
