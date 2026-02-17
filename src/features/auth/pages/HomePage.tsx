import { Link } from 'react-router-dom'

import { buttonClassName } from '../../../components/ui/buttonClassName'
import { Card } from '../../../components/ui/Card'

const processSteps = [
  {
    title: 'Add input in one minute',
    description: 'Drop product photos or paste rough notes to start a structured draft.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M12 3v18m9-9H3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Generate optimized copy',
    description: 'AI crafts title, bullets, and price guidance aligned to marketplace tone.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M4 7h16M4 12h10M4 17h7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Review, polish, and publish',
    description: 'Adjust details fast, then copy your listing and launch with confidence.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="m5 12 4 4L19 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

export function HomePage() {
  return (
    <div className="space-y-16 md:space-y-24">
      <section className="relative overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-5 py-9 shadow-[var(--shadow-sm)] md:px-10 md:py-14 lg:px-12 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full"
          style={{
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--color-primary-start) 16%, transparent 84%) 0%, transparent 70%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full"
          style={{
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 16%, transparent 84%) 0%, transparent 72%)',
          }}
        />

        <div className="relative grid grid-cols-1 gap-9 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-center lg:gap-10">
          <div>
            <p className="inline-flex rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-1 text-xs font-semibold tracking-wide text-[color:var(--color-text-muted)]">
              Marketplace-ready listing copy in minutes
            </p>
            <h1 className="mt-5 max-w-xl pb-2 text-[2.4rem] font-bold leading-[1.12] tracking-tight text-[color:var(--color-text)] md:text-6xl lg:text-7xl">
              Turn product notes into
              <span
                className="block pb-[0.08em] bg-[image:var(--gradient-primary)] bg-clip-text text-transparent"
                style={{ WebkitTextFillColor: 'transparent' }}
              >
                premium listing output
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[color:var(--color-text-muted)] md:text-lg md:leading-relaxed">
              ListingCopilot generates optimized titles, bullets, and pricing guidance so your listings
              look polished, consistent, and ready to publish.
            </p>

            <div className="mt-9 grid max-w-sm grid-cols-1 gap-3 sm:max-w-none sm:flex sm:flex-wrap">
              <Link
                to="/signup"
                className={buttonClassName({ variant: 'primary', size: 'lg', className: 'w-full sm:w-auto' })}
              >
                Start Free
              </Link>
              <Link
                to="/login"
                className={buttonClassName({ variant: 'secondary', size: 'lg', className: 'w-full sm:w-auto' })}
              >
                Login
              </Link>
            </div>

            <div className="mt-8 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-3">
                <p className="text-base font-semibold text-[color:var(--color-text)] md:text-lg">60s</p>
                <p className="text-xs text-[color:var(--color-text-muted)]">to first draft</p>
              </div>
              <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-3">
                <p className="text-base font-semibold text-[color:var(--color-text)] md:text-lg">3x</p>
                <p className="text-xs text-[color:var(--color-text-muted)]">faster iterations</p>
              </div>
              <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-3">
                <p className="text-base font-semibold text-[color:var(--color-text)] md:text-lg">1 click</p>
                <p className="text-xs text-[color:var(--color-text-muted)]">publish flow</p>
              </div>
            </div>
          </div>

          <Card className="relative p-4">
            <div
              className="surface-elevated rounded-xl p-5"
              style={{
                background:
                  'linear-gradient(135deg, color-mix(in srgb, var(--color-primary-start) 12%, var(--color-surface-muted) 88%) 0%, color-mix(in srgb, var(--color-primary-end) 8%, var(--color-surface-muted) 92%) 100%)',
              }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[color:var(--color-text)]">Product Preview</p>
                <span className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2 py-1 text-xs font-medium text-[color:var(--color-text-muted)]">
                  Auto-generated
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="surface-elevated overflow-hidden p-0 shadow-none">
                <div className="aspect-[16/9] w-full bg-[image:var(--gradient-primary)] p-4 text-[color:var(--color-primary-foreground)]">
                  <div className="flex h-full flex-col justify-between">
                    <span className="inline-flex w-fit rounded-xl px-2 py-1 text-xs font-medium"
                      style={{
                        background:
                          'color-mix(in srgb, var(--color-primary-foreground) 20%, transparent 80%)',
                      }}
                    >
                      Preview image
                    </span>
                    <p className="max-w-xs text-sm font-semibold leading-tight">
                      Wireless Headphones with ANC, 40H Battery, USB-C Fast Charge
                    </p>
                  </div>
                </div>
              </div>

              <div className="surface-elevated bg-[color:var(--color-surface-muted)] p-4 shadow-none">
                <p className="text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">Key bullets</p>
                <ul className="mt-2 space-y-1 text-sm text-[color:var(--color-text-muted)]">
                  <li>Adaptive ANC for commute, work, and travel.</li>
                  <li>Lightweight fold-flat build with padded comfort.</li>
                  <li>Suggested range: $89 - $109.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-6 md:space-y-7">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--color-text)] md:text-4xl">
            Built for a fast listing workflow
          </h2>
          <p className="text-base text-[color:var(--color-text-muted)]">
            A clear three-step flow from rough product input to polished marketplace copy.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {processSteps.map((step, index) => (
            <Card key={step.title} className="h-full space-y-4 p-5 md:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-[color:var(--color-primary-foreground)]">
                  {step.icon}
                </div>
                <span className="text-xs font-semibold tracking-wide text-[color:var(--color-text-muted)]">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[color:var(--color-text)] md:text-xl">{step.title}</h3>
              <p className="text-sm leading-relaxed text-[color:var(--color-text-muted)]">{step.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="surface-elevated overflow-hidden p-6 md:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--color-text)] md:text-4xl">
              Example listing output
            </h2>
            <p className="mt-2 text-base text-[color:var(--color-text-muted)]">
              See how generated copy and visuals appear before saving to your workspace.
            </p>

            <div className="mt-6 space-y-4">
              <div className="surface-elevated bg-[color:var(--color-surface-muted)] p-4">
                <p className="text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">Title</p>
                <p className="mt-2 text-base font-semibold leading-snug text-[color:var(--color-text)]">
                  Handcrafted Ceramic Coffee Mug, 14 oz, Dishwasher-Safe, Speckled Clay Finish
                </p>
              </div>
              <div className="surface-elevated bg-[color:var(--color-surface-muted)] p-4">
                <p className="text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">Bullets</p>
                <ul className="mt-2 space-y-1 text-sm text-[color:var(--color-text-muted)]">
                  <li>Stoneware body with comfortable rounded handle.</li>
                  <li>Neutral finish pairs with modern kitchen setups.</li>
                  <li>Safe for microwave and top-rack dishwasher cycles.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="surface-elevated bg-[color:var(--color-surface-muted)] p-5">
              <p className="text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">Price guidance</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text)]">$24 - $29</p>
              <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">
                Balanced against similar handcrafted mugs and finish quality.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {["Front", "Angle", "Lifestyle"].map((label) => (
                <div key={label} className="surface-elevated overflow-hidden p-0">
                  <div className="aspect-[4/3] bg-[image:var(--gradient-primary)] p-2 text-[color:var(--color-primary-foreground)]">
                    <div className="flex h-full items-end">
                      <span
                        className="rounded-xl px-2 py-1 text-xs"
                        style={{
                          background:
                            'color-mix(in srgb, var(--color-primary-foreground) 20%, transparent 80%)',
                        }}
                      >
                        {label}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="surface-elevated overflow-hidden p-7 md:p-10" style={{ background: 'var(--gradient-primary)' }}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--color-primary-foreground)] md:text-4xl">
              Ready to accelerate your listings?
            </h2>
            <p
              className="mt-3 max-w-2xl text-base"
              style={{ color: 'color-mix(in srgb, var(--color-primary-foreground) 86%, transparent 14%)' }}
            >
              Join ListingCopilot and move from draft product notes to clean marketplace-ready copy in
              a faster, repeatable workflow.
            </p>
          </div>

          <div className="grid max-w-sm grid-cols-1 gap-3 sm:max-w-none sm:flex sm:flex-wrap md:justify-end">
            <Link
              to="/signup"
              className={buttonClassName({
                variant: 'secondary',
                size: 'lg',
                className: 'w-full border-[color:var(--color-surface)] bg-[color:var(--color-surface)] sm:w-auto',
              })}
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className={buttonClassName({
                variant: 'secondary',
                size: 'lg',
                className:
                  'w-full border-white/45 bg-white/6 text-[color:var(--color-primary-foreground)] hover:bg-white/16 focus-visible:ring-white/45 sm:w-auto',
              })}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
