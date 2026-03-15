import { useId } from 'react'

import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Textarea } from '../../../components/ui/Textarea'
import { ListingThumbnail } from './ListingThumbnail'
import { getListingStatus } from './listingVisuals'
import type { ListingDraft } from '../types'
import { cn } from '../../../lib/utils'

type ListingPreviewProps = {
  className?: string
  draft: ListingDraft
  onChange: (nextDraft: ListingDraft) => void
  onReset: () => void
  onSave: () => void
  isSaving: boolean
  saveError: string | null
  onCopy: () => void
  onRegenerate: () => void
  canRegenerate: boolean
  isRegenerating: boolean
  imageUrl: string | null
}

export function ListingPreview({
  className,
  draft,
  onChange,
  onReset,
  onSave,
  isSaving,
  saveError,
  onCopy,
  onRegenerate,
  canRegenerate,
  isRegenerating,
  imageUrl,
}: ListingPreviewProps) {
  const bulletGroupId = useId()
  const status = getListingStatus(draft)

  function updateBullet(index: number, nextValue: string) {
    const nextBullets = [...draft.bullet_points]
    nextBullets[index] = nextValue
    onChange({ ...draft, bullet_points: nextBullets })
  }

  function removeBullet(index: number) {
    onChange({
      ...draft,
      bullet_points: draft.bullet_points.filter((_, itemIndex) => itemIndex !== index),
    })
  }

  function addBullet() {
    onChange({ ...draft, bullet_points: [...draft.bullet_points, ''] })
  }

  return (
    <Card className={cn('overflow-hidden p-0', className)}>
      <div aria-hidden="true" className="h-1 bg-[image:var(--gradient-primary)]" />
      <CardHeader className="px-6 pb-0 pt-7 md:px-7">
        <p className="eyebrow w-fit rounded-full bg-[color:var(--color-warning-bg)] px-3 py-1 text-[color:var(--color-warning-text)]">
          Preview editor
        </p>
        <CardTitle className="mt-4 flex flex-wrap items-center gap-2">
          Listing draft
          <Badge variant={status === 'READY' ? 'success' : 'warning'}>{status}</Badge>
        </CardTitle>
        <CardDescription>Edit fields in marketplace order, then save or copy the result.</CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-6 md:px-7 md:pb-7">
        <section className="space-y-3">
          {imageUrl ? (
            <ListingThumbnail
              className="aspect-video"
              title={draft.title}
              subtitle={`$${draft.price_min.toLocaleString()} - $${draft.price_max.toLocaleString()}`}
              src={imageUrl}
              showFallbackLabel
              alt={`${draft.title || 'Listing'} preview image`}
            />
          ) : (
            <div className="practical-grid aspect-video rounded-[var(--radius-card)] border border-dashed border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-muted)] p-5">
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-muted)] shadow-[var(--shadow-sm)]">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
                    <path
                      d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Zm2.5-.5a.5.5 0 0 0-.5.5v8.37l3.53-3.52a1.5 1.5 0 0 1 2.12 0l1.65 1.64 2.94-2.94a1.5 1.5 0 0 1 2.12 0L18 11.42V7.5a.5.5 0 0 0-.5-.5h-11ZM18 14.25l-1.17-1.17a.5.5 0 0 0-.71 0l-2.94 2.94a1.5 1.5 0 0 1-2.12 0l-1.65-1.64a.5.5 0 0 0-.71 0L6 17h11.5a.5.5 0 0 0 .5-.5v-2.25ZM9 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <p className="mt-4 text-lg font-bold tracking-[-0.03em] text-[color:var(--color-text)]">No product image yet</p>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[color:var(--color-text-secondary)]">
                  Upload a product image to show the real item here. Text-only drafts keep the preview focused on the generated copy.
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.52fr)] xl:items-start">
          <div className="min-w-0 rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4 sm:p-5">
            <div className="space-y-2">
              <label
                htmlFor="preview-title"
                className="block text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]"
              >
                Title
              </label>
              <Input
                id="preview-title"
                value={draft.title}
                onChange={(event) => onChange({ ...draft, title: event.target.value })}
                placeholder="Listing title"
                className="bg-[color:var(--color-surface)] shadow-none"
              />
            </div>

            <div className="mt-5 space-y-2 border-t border-[color:var(--color-border)] pt-5">
              <p id={bulletGroupId} className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
                Bullet points
              </p>
              <div className="space-y-2">
                {draft.bullet_points.map((bullet, index) => (
                  <div key={`bullet-${index}`} className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <label htmlFor={`preview-bullet-${index}`} className="sr-only">
                      Bullet point {index + 1}
                    </label>
                    <Input
                      id={`preview-bullet-${index}`}
                      value={bullet}
                      onChange={(event) => updateBullet(index, event.target.value)}
                      placeholder={`Bullet ${index + 1}`}
                      aria-labelledby={bulletGroupId}
                      className="bg-[color:var(--color-surface)]"
                    />
                    <Button
                      variant="danger-subtle"
                      size="sm"
                      onClick={() => removeBullet(index)}
                      aria-label={`Remove bullet ${index + 1}`}
                      className="h-10 w-full justify-start gap-1.5 px-3 lg:w-auto lg:justify-center"
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M9 3a1 1 0 0 0-1 1v1H5a1 1 0 1 0 0 2h.09l.82 11.47A2 2 0 0 0 7.9 20h8.2a2 2 0 0 0 1.99-1.53L18.91 7H19a1 1 0 1 0 0-2h-3V4a1 1 0 0 0-1-1H9Zm2 2V5h2v0h-2Zm-3.9 2h9.8l-.8 11H7.9l-.8-11Zm3.9 2a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-1-1Zm3 0a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-1-1Z"
                        />
                      </svg>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="secondary" size="sm" onClick={addBullet} className="w-full sm:w-auto">
                Add bullet
              </Button>
            </div>

            <div className="mt-5 space-y-2 border-t border-[color:var(--color-border)] pt-5">
              <label
                htmlFor="preview-description"
                className="block text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]"
              >
                Description
              </label>
              <Textarea
                id="preview-description"
                value={draft.description}
                onChange={(event) => onChange({ ...draft, description: event.target.value })}
                rows={5}
                className="min-h-40 bg-[color:var(--color-surface)] shadow-none"
                placeholder="Listing description"
              />
            </div>

          </div>

          <aside className="surface-elevated min-w-0 self-start rounded-[var(--radius-card)] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
              Price range
            </p>
            <p className="mt-2 text-3xl font-bold tracking-[-0.05em] text-[color:var(--color-text)]">
              ${draft.price_min.toLocaleString()} - ${draft.price_max.toLocaleString()}
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
              Adjust in the generated prompt if market comps suggest a tighter range.
            </p>

            <div className="mt-5 border-t border-[color:var(--color-border)] pt-4">
              <div className="space-y-2">
                <Button
                  onClick={onSave}
                  disabled={isSaving}
                  size="lg"
                  className="w-full whitespace-nowrap"
                >
                  {isSaving ? 'Saving...' : 'Save listing'}
                </Button>
                <Button variant="secondary" onClick={onCopy} className="w-full whitespace-nowrap">
                  Copy listing
                </Button>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Button
                    variant="ghost"
                    onClick={onRegenerate}
                    disabled={!canRegenerate || isRegenerating}
                    className="h-10 whitespace-nowrap text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]"
                  >
                    {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                  </Button>
                  <Button
                    variant="danger-subtle"
                    onClick={onReset}
                    className="h-10 whitespace-nowrap"
                  >
                    Reset draft
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </CardContent>

      {saveError ? <p className="px-6 pb-1 text-sm text-[color:var(--color-danger)]">{saveError}</p> : null}
    </Card>
  )
}
