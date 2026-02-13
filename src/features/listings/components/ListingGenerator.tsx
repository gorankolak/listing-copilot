import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react'

import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { FormFieldError } from '../../../components/ui/FormFieldError'
import { Input } from '../../../components/ui/Input'
import { Textarea } from '../../../components/ui/Textarea'
import { useAuth } from '../../auth/components/useAuth'
import { listingApi } from '../api'

type InputMode = 'image' | 'text'

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

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

export function ListingGenerator() {
  const { user } = useAuth()

  const [mode, setMode] = useState<InputMode>('image')
  const [textInput, setTextInput] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [uploadSuccessUrl, setUploadSuccessUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    setUploadSuccessUrl(null)
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setUploadSuccessUrl(null)
    setSubmitError(null)
    setSelectedImage(file)
    setImageError(validateImageFile(file))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)
    setUploadSuccessUrl(null)

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
        setIsSubmitting(true)
        const publicUrl = await listingApi.uploadInputImage(user.id, selectedImage)
        setUploadSuccessUrl(publicUrl)
      } catch (uploadError) {
        setSubmitError(uploadError instanceof Error ? uploadError.message : 'Image upload failed.')
      } finally {
        setIsSubmitting(false)
      }

      return
    }

    if (textError) {
      return
    }

    setUploadSuccessUrl('Text input ready for generation.')
  }

  return (
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
          >
            Image
          </Button>
          <Button
            variant={mode === 'text' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleModeChange('text')}
            aria-pressed={mode === 'text'}
          >
            Text
          </Button>
        </div>

        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          {mode === 'image' ? (
            <div className="space-y-2">
              <label htmlFor="listing-image-upload" className="block text-sm font-medium text-gray-700">
                Product image
              </label>
              <Input
                id="listing-image-upload"
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                onChange={handleImageChange}
                aria-invalid={Boolean(imageError)}
              />
              <p className="text-xs text-gray-500">Accepted: JPG, PNG, WEBP. Max size: 10MB.</p>
              <FormFieldError message={imageError} />
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="listing-text-input" className="block text-sm font-medium text-gray-700">
                Product details
              </label>
              <Textarea
                id="listing-text-input"
                value={textInput}
                onChange={(event) => setTextInput(event.target.value)}
                placeholder="Brand, model, condition, accessories, and any important details."
                aria-invalid={Boolean(textError)}
              />
              <FormFieldError message={textError} />
            </div>
          )}

          <Button type="submit" disabled={isSubmitDisabled}>
            {isSubmitting ? 'Uploading image...' : 'Generate listing'}
          </Button>

          <FormFieldError message={submitError} />
          {uploadSuccessUrl ? <p className="text-sm text-green-700">{uploadSuccessUrl}</p> : null}
        </form>
      </CardContent>
    </Card>
  )
}
