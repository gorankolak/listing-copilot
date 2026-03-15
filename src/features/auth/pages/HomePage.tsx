import { Link } from 'react-router-dom'

import { buttonClassName } from '../../../components/ui/buttonClassName'
import { Card } from '../../../components/ui/Card'

const processSteps = [
  {
    title: 'Add input in one minute',
    description:
      'Drop product photos or paste rough notes to start a structured first draft.',
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
    description:
      'Create a stronger title, concise bullets, and price guidance in one pass.',
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
    title: 'Review, polish, and save',
    description:
      'Edit the result directly in the preview workspace, then copy or save it.',
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
  const demoHeadphoneImageUrl =
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80'
  const demoMugImageUrl =
    'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=80'
  const sectionLabelClassName =
    'text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]'

  return (
    <div className="space-y-12 md:space-y-16">
      <section className="section-shell practical-grid relative overflow-hidden px-5 py-6 md:px-10 md:py-8 lg:px-12 lg:py-10">
        <div
          aria-hidden="true"
          className="decor-orb-primary pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full"
        />
        <div
          aria-hidden="true"
          className="decor-orb-accent pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full"
        />

        <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-center lg:gap-8">
          <div className="space-y-4">
            <p className={sectionLabelClassName}>Built for practical selling teams</p>
            <h1 className="max-w-2xl text-[2.85rem] font-extrabold leading-[0.94] tracking-[-0.065em] text-[color:var(--color-text)] md:text-[4.7rem]">
              Turn rough product notes into listings that sell.
            </h1>
            <p className="max-w-lg text-base leading-7 text-[color:var(--color-text-secondary)] md:text-lg">
              Generate a clear title, sharp bullets, a usable description, and price
              guidance in one focused workflow.
            </p>

            <div className="grid max-w-sm grid-cols-1 gap-3 sm:max-w-none sm:flex sm:flex-wrap">
              <Link
                to="/signup"
                className={buttonClassName({
                  variant: 'primary',
                  size: 'lg',
                  className: 'w-full sm:w-auto',
                })}
              >
                Start Free
              </Link>
              <Link
                to="/login"
                className={buttonClassName({
                  variant: 'secondary',
                  size: 'lg',
                  className: 'w-full sm:w-auto',
                })}
              >
                See example
              </Link>
            </div>

            <div className="mt-5 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="surface-elevated rounded-xl border p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                  To first draft
                </p>
                <p className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[color:var(--color-text)]">
                  60s
                </p>
              </div>
              <div className="surface-elevated rounded-xl border p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                  Faster edits
                </p>
                <p className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[color:var(--color-text)]">
                  3x
                </p>
              </div>
              <div className="surface-elevated rounded-xl border p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                  Input to saved
                </p>
                <p className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[color:var(--color-text)]">
                  1 flow
                </p>
              </div>
            </div>
          </div>

          <Card className="relative mt-6 w-full max-w-md overflow-hidden border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 shadow-[0_20px_45px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-[2px] md:justify-self-end md:p-5 lg:mt-0">
            <div className="panel-subtle p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow text-[color:var(--color-text-muted)]">
                    Preview workspace
                  </p>
                  <p className="mt-1 text-base font-bold tracking-[-0.03em] text-[color:var(--color-text)]">
                    Draft ready to polish
                  </p>
                </div>
                <span className="rounded-full bg-[color:var(--color-accent)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[color:var(--color-navy)]">
                  Ready
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-3">
              <div className="surface-elevated overflow-hidden p-0 shadow-none">
                <div className="relative aspect-[16/10] max-h-[16rem] w-full overflow-hidden p-4 text-[color:var(--color-primary-foreground)]">
                  <img
                    src={demoHeadphoneImageUrl}
                    alt="Wireless over-ear headphones"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[rgba(24,32,51,0.84)] via-[rgba(24,32,51,0.34)] to-transparent"
                  />
                  <div className="relative flex h-full flex-col justify-between">
                    <span className="chip-on-primary inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em]">
                      Input image
                    </span>
                    <p className="max-w-xs text-base font-bold leading-tight tracking-[-0.03em]">
                      Wireless Headphones with ANC, 40H Battery, USB-C Fast Charge
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="eyebrow text-[color:var(--color-text-muted)]">Output</p>
                  <p className="mt-2 line-clamp-2 max-w-[30ch] text-sm leading-5 text-[color:var(--color-text-secondary)]">
                    Adaptive ANC for commute and travel. USB-C fast charge • 40h battery.
                  </p>
                </div>
                <div className="justify-self-end text-right">
                  <p className="eyebrow text-[11px] text-[color:var(--color-text-muted)]">
                    Price guide
                  </p>
                  <p className="mt-2 whitespace-nowrap text-2xl font-bold tracking-[-0.05em] text-[color:var(--color-text)]">
                    $89–$109
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-6 md:space-y-7">
        <div className="max-w-3xl space-y-2">
          <p className={sectionLabelClassName}>Workflow</p>
          <h2 className="section-heading">
            A disciplined path from rough input to marketplace-ready copy.
          </h2>
          <p className="text-base leading-7 text-[color:var(--color-text-secondary)]">
            Each step is visible, structured, and tuned for quick seller review instead of
            generic AI output.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {processSteps.map((step, index) => (
            <Card key={step.title} className="h-full space-y-5 p-5 md:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-button)] bg-[color:var(--color-navy)] text-[color:var(--color-accent)]">
                  {step.icon}
                </div>
                <span className="eyebrow text-[color:var(--color-text-muted)]">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-[-0.03em] text-[color:var(--color-text)]">
                {step.title}
              </h3>
              <p className="text-sm leading-6 text-[color:var(--color-text-secondary)]">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-shell overflow-hidden p-6 md:p-8 lg:p-10">
        <div className="max-w-3xl">
          <p className={sectionLabelClassName}>Example output</p>
          <h2 className="section-heading mt-4">
            Preview exactly what the seller will review before saving.
          </h2>
          <p className="mt-3 text-base leading-7 text-[color:var(--color-text-secondary)]">
            Real title, bullets, description, and price guidance arranged as a working
            product panel instead of filler marketing chrome.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-stretch">
          <div className="panel-subtle flex h-full flex-col p-5 md:p-6">
            <div>
              <p className="eyebrow text-[color:var(--color-text-muted)]">
                Listing summary
              </p>
              <p className="mt-3 text-2xl font-bold leading-snug tracking-[-0.04em] text-[color:var(--color-text)] md:text-[2rem]">
                Handcrafted Ceramic Coffee Mug, 14 oz, Dishwasher-Safe, Speckled Clay
                Finish
              </p>
            </div>

            <div className="mt-6 border-t border-[color:var(--color-border)] pt-5">
              <p className="eyebrow text-[color:var(--color-text-muted)]">Key bullets</p>
              <ul className="mt-3 space-y-2 text-base leading-relaxed text-[color:var(--color-text-secondary)]">
                <li>Stoneware body with comfortable rounded handle.</li>
                <li>Neutral finish pairs with modern kitchen setups.</li>
                <li>Safe for microwave and top-rack dishwasher cycles.</li>
              </ul>
            </div>

            <div className="mt-6 border-t border-[color:var(--color-border)] pt-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow text-[color:var(--color-text-muted)]">
                    Price guidance
                  </p>
                  <p className="mt-2 text-4xl font-bold tracking-[-0.05em] text-[color:var(--color-text)]">
                    $24 - $29
                  </p>
                </div>
                <p className="max-w-xs text-sm leading-6 text-[color:var(--color-text-secondary)]">
                  Balanced against similar handcrafted mugs and finish quality.
                </p>
              </div>
            </div>
          </div>

          <div className="panel-subtle flex h-full flex-col p-4">
            <div className="px-1 pb-3">
              <p className="eyebrow text-[color:var(--color-text-muted)]">
                Product image
              </p>
            </div>
            <div className="surface-elevated flex-1 overflow-hidden p-0">
              <div className="relative aspect-[4/3] h-full min-h-[320px] max-h-[26rem] text-[color:var(--color-primary-foreground)]">
                <img
                  src={demoMugImageUrl}
                  alt="Ceramic coffee mug product photo"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[rgba(24,32,51,0.88)] via-[rgba(24,32,51,0.26)] to-transparent"
                />
                <div className="relative flex h-full flex-col justify-between p-5">
                  <span className="inline-flex w-fit rounded-full bg-white/16 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] backdrop-blur">
                    Example asset
                  </span>
                  <div className="space-y-2">
                    <p className="text-lg font-bold leading-tight tracking-[-0.03em]">
                      Lifestyle image and polished copy stay connected in the same
                      workspace.
                    </p>
                    <p className="max-w-sm text-sm text-white/80">
                      Sellers see the visual asset, output structure, and price
                      recommendation together.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[var(--radius-section)] bg-gradient-to-br from-indigo-500 to-blue-600 px-6 py-10 text-[color:var(--color-primary-foreground)] shadow-[var(--shadow-sm)] md:px-10 md:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_42%)] opacity-70"
        />
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2 md:items-center">
          <div className="max-w-3xl">
            <p className="eyebrow w-fit rounded-full bg-white/14 px-3 py-1 text-white/80">
              Start now
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.05em] md:text-5xl">
              Build stronger listings in a workspace that feels production-ready.
            </h2>
            <p className="mt-3 max-w-xl text-base text-white/82">
              One tool for input, generation, polish, and saving. No generic AI blank
              page.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/signup"
              className={buttonClassName({
                variant: 'primary',
                className: 'w-full sm:w-auto',
              })}
            >
              Create account
            </Link>
            <Link
              to="/login"
              className={buttonClassName({
                variant: 'secondary',
                className: 'w-full sm:w-auto',
              })}
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
