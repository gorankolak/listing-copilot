import {
  type FormEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useMutation } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'

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
import { Textarea } from '../../../components/ui/Textarea'
import {
  Toast,
  ToastCloseButton,
  ToastDescription,
  ToastTitle,
  ToastViewport,
} from '../../../components/ui/Toast'
import { supabaseClient } from '../../../lib/supabaseClient'
import { useAuth } from '../../auth/components/useAuth'
import { listingApi, SessionInvalidatedError } from '../api'
import { buildFormattedListing } from '../buildFormattedListing'
import { ListingPreview } from './ListingPreview'
import { listingDraftSchema } from '../schemas'
import { useSaveListingMutation } from '../queries'
import type { ListingDraft } from '../types'
import { ACCEPTED_IMAGE_TYPES, validateImageFile, validateTextInput } from './validation'
import { ImageDropzone } from './ImageDropzone'
import { GeneratingOverlay } from './GeneratingOverlay'

type InputMode = 'image' | 'text'

const LEGACY_DRAFT_STORAGE_KEY = 'listing-generator-draft'
const DRAFT_STORAGE_KEY_PREFIX = 'listing-generator-draft'
const MIN_GENERATING_OVERLAY_MS = 1800
const GENERATING_STEP_INTERVAL_MS = 900

type ToastVariant = 'info' | 'success' | 'warning' | 'error'
type ToastMessage = {
  variant?: ToastVariant
  title: string
  description?: string
}

type ListingGeneratorMemoryState = {
  mode: InputMode
  textInput: string
  selectedImage: File | null
  draft: ListingDraft | null
  lastPayload: { mode: 'image'; imageUrl: string } | { mode: 'text'; text: string } | null
}

let listingGeneratorMemoryState: ListingGeneratorMemoryState | null = null

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
  const navigate = useNavigate()
  const location = useLocation()

  const [mode, setMode] = useState<InputMode>(() => listingGeneratorMemoryState?.mode ?? 'image')
  const [textInput, setTextInput] = useState(() => listingGeneratorMemoryState?.textInput ?? '')
  const [selectedImage, setSelectedImage] = useState<File | null>(
    () => listingGeneratorMemoryState?.selectedImage ?? null,
  )
  const [imageError, setImageError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [draft, setDraft] = useState<ListingDraft | null>(() => listingGeneratorMemoryState?.draft ?? null)
  const [lastPayload, setLastPayload] = useState<
    { mode: 'image'; imageUrl: string } | { mode: 'text'; text: string } | null
  >(() => listingGeneratorMemoryState?.lastPayload ?? null)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isGeneratingOverlayVisible, setIsGeneratingOverlayVisible] = useState(false)
  const [generatingOverlayStartedAt, setGeneratingOverlayStartedAt] = useState<number | null>(null)
  const [generatingStepIndex, setGeneratingStepIndex] = useState(0)
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const textInputRef = useRef<HTMLTextAreaElement | null>(null)
  const submitErrorRef = useRef<HTMLDivElement | null>(null)
  const overlayHideTimeoutRef = useRef<number | null>(null)
  const generationStatusId = useId()
  const imageErrorId = useId()
  const textErrorId = useId()
  const submitErrorId = useId()
  const saveListingMutation = useSaveListingMutation(user?.id ?? null)

  function redirectToLoginForSessionExpiry() {
    const returnTo = `${location.pathname}${location.search}${location.hash}`
    void supabaseClient.auth.signOut().finally(() => {
      navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`, {
        replace: true,
        state: {
          toast: {
            variant: 'warning',
            title: 'Session expired',
            description: 'Please sign in again. Unsaved draft data was preserved.',
          },
        },
      })
    })
  }

  function getDraftStorageKey(userId: string) {
    return `${DRAFT_STORAGE_KEY_PREFIX}:${userId}`
  }

  useEffect(() => {
    const userId = user?.id
    if (!userId) {
      return
    }

    if (listingGeneratorMemoryState?.draft) {
      setDraft(listingGeneratorMemoryState.draft)
      return
    }

    const userStorageKey = getDraftStorageKey(userId)
    const fromStorage =
      localStorage.getItem(userStorageKey) ?? localStorage.getItem(LEGACY_DRAFT_STORAGE_KEY)
    if (!fromStorage) {
      setDraft(null)
      return
    }

    try {
      const parsed = JSON.parse(fromStorage)
      const valid = listingDraftSchema.safeParse(parsed)
      if (!valid.success) {
        setDraft(null)
        return
      }

      setDraft(valid.data)

      // Migrate old global draft storage to user-scoped storage.
      localStorage.setItem(userStorageKey, JSON.stringify(valid.data))
      localStorage.removeItem(LEGACY_DRAFT_STORAGE_KEY)
    } catch {
      setDraft(null)
    }
  }, [user?.id])

  useEffect(() => {
    listingGeneratorMemoryState = {
      mode,
      textInput,
      selectedImage,
      draft,
      lastPayload,
    }
  }, [draft, lastPayload, mode, selectedImage, textInput])

  useEffect(() => {
    if (!submitError) {
      return
    }

    window.requestAnimationFrame(() => submitErrorRef.current?.focus())
  }, [submitError])

  function setDraftAndPersist(nextDraft: ListingDraft | null) {
    setDraft(nextDraft)
    const userId = user?.id
    if (!userId) {
      return
    }

    const userStorageKey = getDraftStorageKey(userId)
    if (nextDraft) {
      localStorage.setItem(userStorageKey, JSON.stringify(nextDraft))
      return
    }

    localStorage.removeItem(userStorageKey)
  }

  const generateMutation = useMutation({
    mutationKey: ['generateListing'],
    mutationFn: listingApi.generateListing,
    onSuccess: (nextDraft) => {
      setSubmitError(null)
      setDraftAndPersist(nextDraft)
    },
    onError: (error) => {
      if (error instanceof SessionInvalidatedError) {
        redirectToLoginForSessionExpiry()
        return
      }

      setSubmitError(
        error instanceof Error ? error.message : 'Listing generation failed.',
      )
    },
  })

  const isGenerationInFlight = isUploadingImage || generateMutation.isPending
  const isSubmitting = isGenerationInFlight || isGeneratingOverlayVisible

  const textError = useMemo(() => {
    if (mode !== 'text') {
      return null
    }

    return validateTextInput(textInput)
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

  useEffect(() => {
    if (isGenerationInFlight) {
      if (overlayHideTimeoutRef.current) {
        window.clearTimeout(overlayHideTimeoutRef.current)
        overlayHideTimeoutRef.current = null
      }

      if (!isGeneratingOverlayVisible) {
        setIsGeneratingOverlayVisible(true)
        setGeneratingOverlayStartedAt(Date.now())
        setGeneratingStepIndex(0)
      }
      return
    }

    if (!isGeneratingOverlayVisible || generatingOverlayStartedAt === null) {
      return
    }

    const elapsed = Date.now() - generatingOverlayStartedAt
    const remaining = Math.max(MIN_GENERATING_OVERLAY_MS - elapsed, 0)
    overlayHideTimeoutRef.current = window.setTimeout(() => {
      setIsGeneratingOverlayVisible(false)
      setGeneratingOverlayStartedAt(null)
      setGeneratingStepIndex(0)
      overlayHideTimeoutRef.current = null
    }, remaining)
  }, [generatingOverlayStartedAt, isGenerationInFlight, isGeneratingOverlayVisible])

  useEffect(() => {
    if (!isGeneratingOverlayVisible || generatingOverlayStartedAt === null) {
      return
    }

    const intervalId = window.setInterval(() => {
      const elapsed = Date.now() - generatingOverlayStartedAt
      const nextStep = Math.min(2, Math.floor(elapsed / GENERATING_STEP_INTERVAL_MS))
      setGeneratingStepIndex(nextStep)
    }, 150)

    return () => window.clearInterval(intervalId)
  }, [generatingOverlayStartedAt, isGeneratingOverlayVisible])

  useEffect(() => {
    return () => {
      if (overlayHideTimeoutRef.current) {
        window.clearTimeout(overlayHideTimeoutRef.current)
      }
    }
  }, [])

  function handleModeChange(nextMode: InputMode) {
    setMode(nextMode)
    setSubmitError(null)
    if (nextMode === 'image') {
      window.requestAnimationFrame(() => imageInputRef.current?.focus())
      return
    }
    window.requestAnimationFrame(() => textInputRef.current?.focus())
  }

  function handleImageChange(file: File | null) {
    setSubmitError(null)
    setSelectedImage(file)
    setImageError(validateImageFile(file))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting || generateMutation.isPending) {
      return
    }

    setSubmitError(null)

    if (!user) {
      setSubmitError('You must be signed in to generate a listing.')
      window.requestAnimationFrame(() => submitErrorRef.current?.focus())
      return
    }

    if (mode === 'image') {
      const error = validateImageFile(selectedImage)
      setImageError(error)

      if (error || !selectedImage) {
        window.requestAnimationFrame(() => imageInputRef.current?.focus())
        return
      }

      try {
        setIsUploadingImage(true)
        const imageUrl = await listingApi.uploadInputImage(user.id, selectedImage)
        const payload = { mode: 'image' as const, imageUrl }
        setLastPayload(payload)
        generateMutation.mutate(payload)
      } catch (uploadError) {
        if (uploadError instanceof SessionInvalidatedError) {
          redirectToLoginForSessionExpiry()
          return
        }

        setSubmitError(
          uploadError instanceof Error ? uploadError.message : 'Image upload failed.',
        )
      } finally {
        setIsUploadingImage(false)
      }

      return
    }

    if (textError) {
      window.requestAnimationFrame(() => textInputRef.current?.focus())
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
    setSaveError(null)
    setDraftAndPersist(nextDraft)
  }

  function handleDraftReset() {
    setSaveError(null)
    setDraftAndPersist(null)
  }

  function handleDraftSave() {
    if (!draft) {
      return
    }

    setSaveError(null)
    saveListingMutation.mutate(draft, {
      onSuccess: () => {
        setToast({
          variant: 'success',
          title: 'Listing saved',
          description: 'Your listing is now available in the dashboard list.',
        })
      },
      onError: (error) => {
        if (error instanceof SessionInvalidatedError) {
          redirectToLoginForSessionExpiry()
          return
        }

        const message = error instanceof Error ? error.message : 'Failed to save listing.'
        setSaveError(message)
      },
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Generate a listing</CardTitle>
          <CardDescription>Choose image upload or text input to start.</CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <GeneratingOverlay
            visible={isGeneratingOverlayVisible}
            stepIndex={generatingStepIndex}
            inputMode={mode}
          />
          <div
            className="inline-flex rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-1"
            role="group"
            aria-label="Generation mode"
          >
            <Button
              variant={mode === 'image' ? 'primary' : 'ghost'}
              size="sm"
              className={mode === 'image' ? 'shadow-[var(--shadow-sm)]' : 'text-[color:var(--color-text-muted)]'}
              onClick={() => handleModeChange('image')}
              aria-pressed={mode === 'image'}
              disabled={isSubmitting}
            >
              Image
            </Button>
            <Button
              variant={mode === 'text' ? 'primary' : 'ghost'}
              size="sm"
              className={mode === 'text' ? 'shadow-[var(--shadow-sm)]' : 'text-[color:var(--color-text-muted)]'}
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
                  className="block text-sm font-medium text-[color:var(--color-text)]"
                >
                  Product image
                </label>
                <ImageDropzone
                  ref={imageInputRef}
                  id="listing-image-upload"
                  accept={ACCEPTED_IMAGE_TYPES.join(',')}
                  file={selectedImage}
                  onFileChange={handleImageChange}
                  error={imageError}
                  errorId={imageErrorId}
                  disabled={isSubmitting}
                />
                <FormFieldError id={imageErrorId} message={imageError} />
              </div>
            ) : (
              <div className="space-y-2">
                <label
                  htmlFor="listing-text-input"
                  className="block text-sm font-medium text-[color:var(--color-text)]"
                >
                  Product details
                </label>
                <Textarea
                  ref={textInputRef}
                  id="listing-text-input"
                  value={textInput}
                  onChange={(event) => setTextInput(event.target.value)}
                  placeholder="Brand, model, condition, accessories, and any important details."
                  aria-invalid={Boolean(textError)}
                  aria-describedby={textError ? textErrorId : undefined}
                  disabled={isSubmitting}
                />
                <FormFieldError id={textErrorId} message={textError} />
              </div>
            )}

            <Button type="submit" disabled={isSubmitDisabled}>
              Generate listing
            </Button>

            <p
              id={generationStatusId}
              className="text-sm text-[color:var(--color-text-muted)]"
              role="status"
              aria-live="polite"
            >
              {isGenerationInFlight || isGeneratingOverlayVisible
                ? 'AI generation in progress.'
                : draft
                  ? 'Listing draft generated and ready for review.'
                  : 'Ready to generate a listing.'}
            </p>

            <div ref={submitErrorRef} tabIndex={-1}>
              <FormFieldError id={submitErrorId} message={submitError} />
            </div>
            {submitError && lastPayload ? (
              <ErrorBanner
                tabIndex={-1}
                title="Generation failed"
                message="Please retry. Your inputs were preserved."
              >
                <ErrorBannerActionButton
                  onClick={() => generateMutation.mutate(lastPayload)}
                  disabled={isSubmitting}
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
          onSave={handleDraftSave}
          isSaving={saveListingMutation.isPending}
          saveError={saveError}
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
