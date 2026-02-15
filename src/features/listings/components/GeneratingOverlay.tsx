import { useId } from 'react'

import { cn } from '../../../lib/utils'

type InputMode = 'image' | 'text'

type GeneratingOverlayProps = {
  visible: boolean
  stepIndex: number
  inputMode: InputMode
}

const generationSteps = [
  {
    label: 'Analyzing',
    detailByMode: {
      image: 'Reading image cues and product signals.',
      text: 'Parsing product details and condition notes.',
    },
  },
  {
    label: 'Crafting',
    detailByMode: {
      image: 'Building title and core description.',
      text: 'Drafting title and structured description.',
    },
  },
  {
    label: 'Optimizing',
    detailByMode: {
      image: 'Refining language for marketplace performance.',
      text: 'Polishing language for marketplace performance.',
    },
  },
] as const

export function GeneratingOverlay({
  visible,
  stepIndex,
  inputMode,
}: GeneratingOverlayProps) {
  const gradientId = useId()
  const clampedStepIndex = Math.max(0, Math.min(stepIndex, generationSteps.length - 1))
  const progress = ((clampedStepIndex + 1) / generationSteps.length) * 100
  const ringRadius = 31
  const ringCircumference = 2 * Math.PI * ringRadius
  const ringDashOffset = ringCircumference * (1 - progress / 100)

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        'pointer-events-none absolute inset-0 z-20 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/94 backdrop-blur-[2px] transition-opacity duration-250',
        visible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div className="ai-overlay-shimmer absolute inset-x-0 top-0 h-0.5 rounded-full" />

      <div className="flex h-full flex-col items-center justify-center gap-6 p-6">
        <div className="relative h-20 w-20" role="img" aria-label={`${Math.round(progress)}% complete`}>
          <svg className="h-20 w-20" viewBox="0 0 80 80" aria-hidden="true">
            <defs>
              <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="var(--color-primary-start)" />
                <stop offset="100%" stopColor="var(--color-primary-end)" />
              </linearGradient>
            </defs>
            <circle
              cx="40"
              cy="40"
              r={ringRadius}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="6"
            />
            <circle
              cx="40"
              cy="40"
              r={ringRadius}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringDashOffset}
              strokeLinecap="round"
              strokeWidth="6"
              transform="rotate(-90 40 40)"
              style={{ transition: 'stroke-dashoffset 420ms ease' }}
            />
          </svg>
        </div>

        <div className="w-full max-w-md space-y-2" role="status" aria-live="polite">
          <p className="text-center text-sm font-medium text-[color:var(--color-text)]">
            AI is generating your listing
          </p>
          <ol className="space-y-2">
            {generationSteps.map((step, index) => {
              const isCompleted = index < clampedStepIndex
              const isActive = index === clampedStepIndex

              return (
                <li
                  key={step.label}
                  className={cn(
                    'surface-elevated flex items-start justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                    isActive && 'ring-accent',
                  )}
                >
                  <div className="min-w-0">
                    <p
                      className={cn(
                        'font-medium',
                        isCompleted || isActive
                          ? 'text-[color:var(--color-text)]'
                          : 'text-[color:var(--color-text-muted)]',
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-[color:var(--color-text-muted)]">
                      {step.detailByMode[inputMode]}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'rounded-xl px-2 py-0.5 text-xs font-medium',
                      isCompleted && 'bg-[color:var(--color-success-bg)] text-[color:var(--color-success-text)]',
                      isActive && 'bg-[color:var(--color-info-bg)] text-[color:var(--color-info-text)]',
                      !isCompleted &&
                        !isActive &&
                        'bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-muted)]',
                    )}
                  >
                    {isCompleted ? 'Done' : isActive ? 'In progress' : 'Pending'}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}
