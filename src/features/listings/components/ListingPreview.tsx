import { useId } from 'react'

import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Textarea } from '../../../components/ui/Textarea'
import { ListingThumbnail } from './ListingThumbnail'
import { getListingStatus } from './listingVisuals'
import type { ListingDraft } from '../types'

type ListingPreviewProps = {
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
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          Listing preview
          <Badge variant={status === 'READY' ? 'success' : 'warning'}>{status}</Badge>
        </CardTitle>
        <CardDescription>Edit content before saving or copying.</CardDescription>
      </CardHeader>

      <CardContent>
        <section className="space-y-3">
          <ListingThumbnail
            className="aspect-video"
            title={draft.title}
            subtitle={`$${draft.price_min.toLocaleString()} - $${draft.price_max.toLocaleString()}`}
            src={imageUrl}
            alt={`${draft.title || 'Listing'} preview image`}
          />
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            <ListingThumbnail
              className="aspect-video"
              title={draft.title}
              subtitle="Front view"
              alt={`${draft.title || 'Listing'} front image`}
            />
            <ListingThumbnail
              className="aspect-video"
              title={draft.title}
              subtitle="Detail view"
              alt={`${draft.title || 'Listing'} detail image`}
            />
            <ListingThumbnail
              className="aspect-video"
              title={draft.title}
              subtitle="In-use view"
              alt={`${draft.title || 'Listing'} lifestyle image`}
            />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="preview-title"
                className="block text-sm font-medium text-[color:var(--color-text)]"
              >
                Title
              </label>
              <Input
                id="preview-title"
                value={draft.title}
                onChange={(event) => onChange({ ...draft, title: event.target.value })}
                placeholder="Listing title"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="preview-description"
                className="block text-sm font-medium text-[color:var(--color-text)]"
              >
                Description
              </label>
              <Textarea
                id="preview-description"
                value={draft.description}
                onChange={(event) => onChange({ ...draft, description: event.target.value })}
                rows={5}
                placeholder="Listing description"
              />
            </div>

            <div className="space-y-2">
              <p
                id={bulletGroupId}
                className="block text-sm font-medium text-[color:var(--color-text)]"
              >
                Bullet points
              </p>
              <div className="space-y-2">
                {draft.bullet_points.map((bullet, index) => (
                  <div key={`bullet-${index}`} className="flex flex-col gap-2 sm:flex-row">
                    <label htmlFor={`preview-bullet-${index}`} className="sr-only">
                      Bullet point {index + 1}
                    </label>
                    <Input
                      id={`preview-bullet-${index}`}
                      value={bullet}
                      onChange={(event) => updateBullet(index, event.target.value)}
                      placeholder={`Bullet ${index + 1}`}
                      aria-labelledby={bulletGroupId}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBullet(index)}
                      aria-label={`Remove bullet ${index + 1}`}
                      className="sm:self-start"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="secondary" size="sm" onClick={addBullet}>
                Add bullet
              </Button>
            </div>
          </div>

          <aside className="surface-elevated rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[color:var(--color-text-muted)]">
              Price range
            </p>
            <p className="mt-2 text-2xl font-semibold text-[color:var(--color-text)]">
              ${draft.price_min.toLocaleString()} - ${draft.price_max.toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">
              Adjust in the generated prompt if market comps suggest a tighter range.
            </p>
          </aside>
        </section>
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Button
          onClick={onSave}
          disabled={isSaving}
          size="lg"
          className="whitespace-nowrap sm:min-w-[12rem]"
        >
          {isSaving ? 'Saving...' : 'Save listing'}
        </Button>
        <Button variant="secondary" onClick={onCopy} className="whitespace-nowrap">
          Copy listing
        </Button>
        <Button
          variant="ghost"
          onClick={onRegenerate}
          disabled={!canRegenerate || isRegenerating}
          className="whitespace-nowrap"
        >
          {isRegenerating ? 'Regenerating...' : 'Regenerate'}
        </Button>
        <Button variant="ghost" onClick={onReset} className="whitespace-nowrap">
          Reset draft
        </Button>
      </CardFooter>

      {saveError ? <p className="mt-2 text-sm text-[color:var(--color-danger)]">{saveError}</p> : null}
    </Card>
  )
}
