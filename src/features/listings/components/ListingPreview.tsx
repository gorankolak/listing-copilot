import { useId } from 'react'

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
import type { ListingDraft } from '../types'

type ListingPreviewProps = {
  draft: ListingDraft
  onChange: (nextDraft: ListingDraft) => void
  onReset: () => void
  onSave: () => void
  isSaving: boolean
  saveError: string | null
  onCopy: () => void
}

export function ListingPreview({
  draft,
  onChange,
  onReset,
  onSave,
  isSaving,
  saveError,
  onCopy,
}: ListingPreviewProps) {
  const bulletGroupId = useId()

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
        <CardTitle>Listing preview</CardTitle>
        <CardDescription>Edit content before saving or copying.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <label htmlFor="preview-title" className="block text-sm font-medium text-gray-700">
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
          <p id={bulletGroupId} className="block text-sm font-medium text-gray-700">
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

        <div className="space-y-2">
          <label
            htmlFor="preview-description"
            className="block text-sm font-medium text-gray-700"
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

        <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
          <p className="text-sm font-medium text-gray-700">Price range</p>
          <p className="mt-1 text-sm text-gray-900">
            ${draft.price_min.toLocaleString()} - ${draft.price_max.toLocaleString()}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch sm:flex-row sm:items-center">
        <Button onClick={onSave} disabled={isSaving} fullWidth>
          {isSaving ? 'Saving...' : 'Save listing'}
        </Button>
        <Button variant="secondary" onClick={onCopy} fullWidth>
          Copy listing
        </Button>
        <Button variant="ghost" onClick={onReset} fullWidth>
          Reset draft
        </Button>
      </CardFooter>
      {saveError ? <p className="mt-2 text-sm text-red-700">{saveError}</p> : null}
    </Card>
  )
}
