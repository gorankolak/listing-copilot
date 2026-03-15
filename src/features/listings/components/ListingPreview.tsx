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
  const sectionLabelClassName =
    'text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]'

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
    <Card className={cn('relative w-full min-w-0 overflow-hidden p-0 md:p-0', className)}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[image:var(--gradient-primary)]" />
      <CardHeader className="px-5 pb-0 pt-5">
        <p className="eyebrow w-fit rounded-full bg-[color:var(--color-warning-bg)] px-3 py-1 text-[color:var(--color-warning-text)]">
          Preview editor
        </p>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <CardTitle className="text-[1.4rem] md:text-[1.55rem]">Listing draft</CardTitle>
          <Badge variant={status === 'READY' ? 'success' : 'warning'}>{status}</Badge>
        </div>
        <CardDescription>Edit fields in marketplace order, then save or copy the result.</CardDescription>
      </CardHeader>

      <CardContent className="min-w-0 px-5 pb-5">
        <section className="mx-auto w-full max-w-[34rem] 2xl:mx-0 2xl:max-w-none">
          {imageUrl ? (
            <ListingThumbnail
              className="aspect-[16/9] max-h-[20rem] lg:max-h-[22rem]"
              title={draft.title}
              subtitle={`$${draft.price_min.toLocaleString()} - $${draft.price_max.toLocaleString()}`}
              src={imageUrl}
              showFallbackLabel
              alt={`${draft.title || 'Listing'} preview image`}
            />
          ) : (
            <div className="practical-grid image-frame aspect-[16/10] max-h-[22rem] border-dashed p-5">
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
                <p className="mt-2 max-w-sm text-base leading-7 text-[color:var(--color-text-secondary)]">
                  Upload a product image to show the real item here. Text-only drafts keep the preview focused on the generated copy.
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="mx-auto w-full max-w-[34rem] space-y-5 2xl:mx-0 2xl:max-w-none">
          <section className="panel-subtle p-4 sm:p-5">
            <div className="space-y-2.5">
              <label
                htmlFor="preview-title"
                className={sectionLabelClassName}
              >
                Title
              </label>
              <Input
                id="preview-title"
                value={draft.title}
                onChange={(event) => onChange({ ...draft, title: event.target.value })}
                placeholder="Listing title"
                className="min-w-0 bg-[color:var(--color-surface)] shadow-none"
              />
            </div>
          </section>

          <section className="panel-subtle p-4 sm:p-5">
            <div className="space-y-3.5">
              <p id={bulletGroupId} className={sectionLabelClassName}>
                Bullet points
              </p>
              <div className="space-y-3.5">
                {draft.bullet_points.map((bullet, index) => (
                  <div
                    key={`bullet-${index}`}
                    className="grid min-w-0 gap-2.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
                  >
                    <label htmlFor={`preview-bullet-${index}`} className="sr-only">
                      Bullet point {index + 1}
                    </label>
                    <Input
                      id={`preview-bullet-${index}`}
                      value={bullet}
                      onChange={(event) => updateBullet(index, event.target.value)}
                      placeholder={`Bullet ${index + 1}`}
                      aria-labelledby={bulletGroupId}
                      className="min-w-0 bg-[color:var(--color-surface)]"
                    />
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={() => removeBullet(index)}
                      aria-label={`Remove bullet ${index + 1}`}
                      className="w-full justify-center gap-1.5 whitespace-nowrap border border-[color:var(--color-error-border)] text-[color:var(--color-error-text)] hover:border-[color:var(--color-danger)]/35 hover:bg-[color:var(--color-error-bg)] hover:text-[color:var(--color-error-text)] sm:w-auto sm:self-start"
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M9 3a1 1 0 0 0-1 1v1H5a1 1 0 1 0 0 2h.09l.82 11.47A2 2 0 0 0 7.9 20h8.2a2 2 0 0 0 1.99-1.53L18.91 7H19a1 1 0 1 0 0-2h-3V4a1 1 0 0 0-1-1H9Zm2 2V5h2v0h-2Zm-3.9 2h9.8l-.8 11H7.9l-.8-11Zm3.9 2a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-1-1Zm3 0a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-1-1Z"
                        />
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="secondary" size="md" onClick={addBullet} className="w-full sm:w-auto">
                Add bullet
              </Button>
            </div>
          </section>

          <section className="panel-subtle p-4 sm:p-5">
            <div className="space-y-2.5">
              <label
                htmlFor="preview-description"
                className={sectionLabelClassName}
              >
                Description
              </label>
              <Textarea
                id="preview-description"
                value={draft.description}
                onChange={(event) => onChange({ ...draft, description: event.target.value })}
                rows={7}
                className="min-h-52 bg-[color:var(--color-surface)] shadow-none"
                placeholder="Listing description"
              />
            </div>
          </section>

          <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <section className="surface-elevated min-w-0 self-start p-4 sm:p-5">
              <p className={sectionLabelClassName}>Price range</p>
              <p className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-[color:var(--color-text)]">
                ${draft.price_min.toLocaleString()} - ${draft.price_max.toLocaleString()}
              </p>
              <p className="mt-3 text-base leading-7 text-[color:var(--color-text-secondary)]">
                Adjust in the generated prompt if market comps suggest a tighter range.
              </p>
            </section>

            <section className="panel-subtle p-4 sm:p-5">
              <p className={sectionLabelClassName}>Actions</p>
              <div className="mt-4 space-y-2.5">
                <Button
                  onClick={onSave}
                  disabled={isSaving}
                  size="md"
                  className="w-full whitespace-nowrap"
                >
                  {isSaving ? 'Saving...' : 'Save listing'}
                </Button>
                <Button variant="secondary" size="md" onClick={onCopy} className="w-full whitespace-nowrap">
                  Copy listing
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={onRegenerate}
                  disabled={!canRegenerate || isRegenerating}
                  className="w-full whitespace-nowrap"
                >
                  {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={onReset}
                  className="w-full whitespace-nowrap border border-[color:var(--color-error-border)] text-[color:var(--color-error-text)] hover:border-[color:var(--color-danger)]/35 hover:bg-[color:var(--color-error-bg)] hover:text-[color:var(--color-error-text)]"
                >
                  Reset draft
                </Button>
              </div>
            </section>
          </div>
        </section>
      </CardContent>

      {saveError ? (
        <p className="px-5 pb-5 text-sm font-medium text-[color:var(--color-danger)]">
          {saveError}
        </p>
      ) : null}
    </Card>
  )
}
