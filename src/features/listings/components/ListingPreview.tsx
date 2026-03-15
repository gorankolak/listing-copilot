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
import { cn } from '../../../lib/utils'
import type { ListingDraft } from '../types'
import { ListingThumbnail } from './ListingThumbnail'
import { getListingStatus } from './listingVisuals'

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
  const priceLabel = `$${draft.price_min.toLocaleString()} - $${draft.price_max.toLocaleString()}`
  const sectionLabelClassName = 'workspace-label'

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

  function handleReset() {
    if (window.confirm('Reset this draft? This will clear your current edits.')) {
      onReset()
    }
  }

  return (
    <Card className={cn('workspace-shell relative w-full min-w-0 overflow-hidden p-0 md:p-0', className)}>
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
        <div className="space-y-5">
          <section className="workspace-canvas p-4 sm:p-5">
            <p className={sectionLabelClassName}>Image</p>
            <div className="mx-auto mt-4 w-full max-w-[34rem]">
              {imageUrl ? (
                <ListingThumbnail
                  className="aspect-[16/9] max-h-[20rem] lg:max-h-[22rem]"
                  title={draft.title}
                  subtitle={priceLabel}
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
            </div>
          </section>

          <div className="space-y-2.5 px-1">
            <label htmlFor="preview-title" className={sectionLabelClassName}>
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

          <section className="workspace-canvas p-5 sm:p-6">
            <div className="space-y-4">
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

          <section className="workspace-canvas p-5 sm:p-6">
            <div className="space-y-3">
              <label htmlFor="preview-description" className={sectionLabelClassName}>
                Description
              </label>
              <Textarea
                id="preview-description"
                value={draft.description}
                onChange={(event) => onChange({ ...draft, description: event.target.value })}
                rows={8}
                className="min-h-60 bg-[color:var(--color-surface)] shadow-none"
                placeholder="Listing description"
              />
            </div>
          </section>

          <section className="workspace-canvas p-4 sm:p-5">
            <p className={sectionLabelClassName}>Price range</p>
            <p className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-[color:var(--color-text)]">
              {priceLabel}
            </p>
            <p className="mt-3 text-base leading-7 text-[color:var(--color-text-secondary)]">
              Adjust in the generated prompt if market comps suggest a tighter range.
            </p>
          </section>

          <section className="workspace-sidebar-panel p-4 sm:p-5">
            <p className={sectionLabelClassName}>Actions</p>
            <div className="mt-4 space-y-2.5">
              <Button
                onClick={onSave}
                disabled={isSaving}
                size="md"
                className="h-11 w-full whitespace-nowrap rounded-lg font-semibold"
              >
                {isSaving ? 'Saving...' : 'Save listing'}
              </Button>
              <Button
                variant="secondary"
                onClick={onCopy}
                className="h-10 w-full whitespace-nowrap rounded-lg border bg-white"
              >
                Copy listing
              </Button>
              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRegenerate}
                  disabled={!canRegenerate || isRegenerating}
                  className="h-auto rounded-none px-0 text-sm font-medium text-slate-500 shadow-none hover:bg-transparent hover:text-slate-800"
                >
                  {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-auto rounded-none px-0 text-sm font-medium text-red-500 shadow-none hover:bg-transparent hover:text-red-600"
                >
                  Reset draft
                </Button>
              </div>
            </div>
          </section>
        </div>

        {saveError ? (
          <p className="mt-4 text-sm font-medium text-[color:var(--color-danger)]">{saveError}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
