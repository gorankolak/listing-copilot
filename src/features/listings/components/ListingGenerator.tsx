import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import { Button } from '../../../components/ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/Card'
import { ErrorBanner, ErrorBannerActionButton } from '../../../components/ui/ErrorBanner'
import { FormFieldError } from '../../../components/ui/FormFieldError'
import { Input } from '../../../components/ui/Input'
import { Textarea } from '../../../components/ui/Textarea'
import {
  Toast,
  ToastCloseButton,
  ToastDescription,
  ToastTitle,
  ToastViewport,
} from '../../../components/ui/Toast'
import { useAuth } from '../../auth/components/useAuth'
import { listingApi } from '../api'
import { buildFormattedListing } from '../buildFormattedListing'
import { ListingPreview } from './ListingPreview'
import { listingDraftSchema } from '../schemas'
import type { ListingDraft } from '../types'

type InputMode = 'image' | 'text'

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const LOCAL_DRAFT_STORAGE_KEY = 'listing-generator-draft'

type ToastVariant = 'info' | 'success' | 'warning' | 'error'
type ToastMessage = {
  variant?: ToastVariant
  title: string
  description?: string
}

function validateImageFile(file: File | null) {
  if (!file) {
    return 'Select an image to continue.'
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Use a JPG, PNG, or WEBP image.'
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return 'Image must be 10MB or smaller.'
  }

  return null
}

function fallbackCopyToClipboard(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()

  let isCopied = false
  try {
    isCopied = document.execCommand('copy')
  } finally {
    document.body.removeChild(textarea)
  }

  return isCopied
}

export function ListingGenerator() {
  const { user } = useAuth()

  const [mode, setMode] = useState<InputMode>('image')
  const [textInput, setTextInput] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [draft, setDraft] = useState<ListingDraft | null>(() => {
    const fromStorage = localStorage.getItem(LOCAL_DRAFT_STORAGE_KEY)
    if (!fromStorage) {
      return null
    }

    try {
      const parsed = JSON.parse(fromStorage)
      const valid = listingDraftSchema.safeParse(parsed)
      return valid.success ? valid.data : null
    } catch {
      return null
    }
  })
  const [lastPayload, setLastPayload] = useState<
    { mode: 'image'; imageUrl: string } | { mode: 'text'; text: string } | null
  >(null)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  function setDraftAndPersist(nextDraft: ListingDraft | null) {
    setDraft(nextDraft)
    if (nextDraft) {
      localStorage.setItem(LOCAL_DRAFT_STORAGE_KEY, JSON.stringify(nextDraft))
      return
    }

    localStorage.removeItem(LOCAL_DRAFT_STORAGE_KEY)
  }

  const generateMutation = useMutation({
    mutationKey: ['generateListing'],
    mutationFn: listingApi.generateListing,
    onSuccess: (nextDraft) => {
      setSubmitError(null)
      setDraftAndPersist(nextDraft)
    },
    onError: (error) => {
      setSubmitError(
        error instanceof Error ? error.message : 'Listing generation failed.',
      )
    },
  })

  const isSubmitting = isUploadingImage || generateMutation.isPending

  const textError = useMemo(() => {
    if (mode !== 'text') {
      return null
    }

    if (!textInput.trim()) {
      return 'Enter product details to continue.'
    }

    return null
  }, [mode, textInput])

  const isSubmitDisabled = useMemo(() => {
    if (!user || isSubmitting) {
      return true
    }

    if (mode === 'image') {
      return Boolean(validateImageFile(selectedImage))
    }

    return Boolean(textError)
  }, [isSubmitting, mode, selectedImage, textError, user])

  function handleModeChange(nextMode: InputMode) {
    setMode(nextMode)
    setSubmitError(null)
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setSubmitError(null)
    setSelectedImage(file)
    setImageError(validateImageFile(file))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)

    if (!user) {
      setSubmitError('You must be signed in to generate a listing.')
      return
    }

    if (mode === 'image') {
      const error = validateImageFile(selectedImage)
      setImageError(error)

      if (error || !selectedImage) {
        return
      }

      try {
        setIsUploadingImage(true)
        const imageUrl = await listingApi.uploadInputImage(user.id, selectedImage)
        const payload = { mode: 'image' as const, imageUrl }
        setLastPayload(payload)
        generateMutation.mutate(payload)
      } catch (uploadError) {
        setSubmitError(
          uploadError instanceof Error ? uploadError.message : 'Image upload failed.',
        )
      } finally {
        setIsUploadingImage(false)
      }

      return
    }

    if (textError) {
      return
    }

    const payload = { mode: 'text' as const, text: textInput.trim() }
    setLastPayload(payload)
    generateMutation.mutate(payload)
  }

  async function handleCopy() {
    if (!draft) {
      return
    }

    const formattedListing = buildFormattedListing(draft)

    try {
      await navigator.clipboard.writeText(formattedListing)
      setToast({
        variant: 'success',
        title: 'Listing copied',
        description: 'Formatted listing content is now in your clipboard.',
      })
      return
    } catch {
      const isFallbackCopySuccess = fallbackCopyToClipboard(formattedListing)
      if (isFallbackCopySuccess) {
        setToast({
          variant: 'success',
          title: 'Listing copied',
          description: 'Used fallback copy because direct clipboard access failed.',
        })
        return
      }
    }

    setToast({
      variant: 'error',
      title: 'Copy failed',
      description: 'Clipboard access is unavailable. Please copy manually.',
    })
  }

  function handleDraftChange(nextDraft: ListingDraft) {
    setDraftAndPersist(nextDraft)
  }

  function handleDraftReset() {
    setDraftAndPersist(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Generate a listing</CardTitle>
          <CardDescription>Choose image upload or text input to start.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={mode === 'image' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleModeChange('image')}
              aria-pressed={mode === 'image'}
              disabled={isSubmitting}
            >
              Image
            </Button>
            <Button
              variant={mode === 'text' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleModeChange('text')}
              aria-pressed={mode === 'text'}
              disabled={isSubmitting}
            >
              Text
            </Button>
          </div>

          <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
            {mode === 'image' ? (
              <div className="space-y-2">
                <label
                  htmlFor="listing-image-upload"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product image
                </label>
                <Input
                  id="listing-image-upload"
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(',')}
                  onChange={handleImageChange}
                  aria-invalid={Boolean(imageError)}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">
                  Accepted: JPG, PNG, WEBP. Max size: 10MB.
                </p>
                <FormFieldError message={imageError} />
              </div>
            ) : (
              <div className="space-y-2">
                <label
                  htmlFor="listing-text-input"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product details
                </label>
                <Textarea
                  id="listing-text-input"
                  value={textInput}
                  onChange={(event) => setTextInput(event.target.value)}
                  placeholder="Brand, model, condition, accessories, and any important details."
                  aria-invalid={Boolean(textError)}
                  disabled={isSubmitting}
                />
                <FormFieldError message={textError} />
              </div>
            )}

            <Button type="submit" disabled={isSubmitDisabled}>
              {isUploadingImage
                ? 'Uploading image...'
                : generateMutation.isPending
                  ? 'Generating listing...'
                  : 'Generate listing'}
            </Button>

            <FormFieldError message={submitError} />
            {submitError && lastPayload ? (
              <ErrorBanner
                title="Generation failed"
                message="Please retry. Your inputs were preserved."
              >
                <ErrorBannerActionButton
                  onClick={() => generateMutation.mutate(lastPayload)}
                >
                  Retry
                </ErrorBannerActionButton>
              </ErrorBanner>
            ) : null}
          </form>
        </CardContent>
      </Card>

      {draft ? (
        <ListingPreview
          draft={draft}
          onChange={handleDraftChange}
          onReset={handleDraftReset}
          onCopy={handleCopy}
        />
      ) : null}

      {toast ? (
        <ToastViewport>
          <Toast variant={toast.variant ?? 'info'}>
            <ToastTitle>{toast.title}</ToastTitle>
            {toast.description ? <ToastDescription>{toast.description}</ToastDescription> : null}
            <ToastCloseButton onClick={() => setToast(null)} />
          </Toast>
        </ToastViewport>
      ) : null}
    </>
  )
}
