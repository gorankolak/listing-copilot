import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from 'react'

import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/utils'

type ImageDropzoneProps = {
  id: string
  accept: string
  file: File | null
  disabled?: boolean
  error?: string | null
  errorId?: string
  onFileChange: (file: File | null) => void
}

export const ImageDropzone = forwardRef<HTMLInputElement, ImageDropzoneProps>(function ImageDropzone(
  { id, accept, file, disabled = false, error, errorId, onFileChange },
  ref,
) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isRemoving, setIsRemoving] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      setIsRemoving(false)
      return
    }

    const nextPreviewUrl = URL.createObjectURL(file)
    setPreviewUrl(nextPreviewUrl)
    return () => URL.revokeObjectURL(nextPreviewUrl)
  }, [file])

  const statusText = useMemo(() => {
    if (file) {
      return `${file.name} (${Math.max(1, Math.round(file.size / 1024))} KB)`
    }
    if (isDragActive) {
      return 'Drop image to upload'
    }
    return 'Drag and drop an image here, or click to browse'
  }, [file, isDragActive])

  function handleFileInput(fileList: FileList | null) {
    const nextFile = fileList?.[0] ?? null
    setIsRemoving(false)
    onFileChange(nextFile)
  }

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    if (disabled) {
      return
    }
    setIsDragActive(true)
  }

  function handleDragLeave(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    if (disabled) {
      return
    }

    if (event.currentTarget.contains(event.relatedTarget as Node)) {
      return
    }
    setIsDragActive(false)
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    if (disabled) {
      return
    }
    setIsDragActive(false)
    handleFileInput(event.dataTransfer.files)
  }

  function handleDropzoneKeyDown(event: KeyboardEvent<HTMLLabelElement>) {
    if (disabled) {
      return
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    inputRef.current?.click()
  }

  function removeImageWithAnimation() {
    setIsRemoving(true)
    window.setTimeout(() => {
      onFileChange(null)
    }, 180)
  }

  return (
    <div className="space-y-2">
      <input
        ref={(node) => {
          inputRef.current = node
          if (!ref) {
            return
          }
          if (typeof ref === 'function') {
            ref(node)
            return
          }
          ref.current = node
        }}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onClick={(event) => {
          event.currentTarget.value = ''
        }}
        onChange={(event) => handleFileInput(event.target.files)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        disabled={disabled}
      />

      <label
        htmlFor={id}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onKeyDown={handleDropzoneKeyDown}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          'dropzone-animated-border relative block min-h-64 cursor-pointer overflow-hidden rounded-xl p-4 transition',
          'focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/30 focus-within:ring-2 focus-within:ring-[color:var(--color-accent)]/30',
          disabled && 'cursor-not-allowed opacity-70',
          isDragActive && !disabled && 'dropzone-active ring-accent',
          error && 'border-[color:var(--color-danger)]',
        )}
      >
        {previewUrl ? (
          <div className={cn('grid gap-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-center', isRemoving && 'dropzone-remove')}>
            <div className="h-28 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
              <img
                src={previewUrl}
                alt={file ? `Preview of ${file.name}` : 'Uploaded image preview'}
                className="h-full w-full rounded-lg object-cover"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-[color:var(--color-text)]">{statusText}</p>
              <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">
                Accepted: JPG, PNG, WEBP. Max size: 10MB.
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 h-8 px-2 text-xs"
                onClick={(event) => {
                  event.preventDefault()
                  removeImageWithAnimation()
                }}
                disabled={disabled}
              >
                Remove image
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex min-h-56 flex-col items-center justify-center text-center">
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-primary)]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 3a1 1 0 0 1 1 1v8.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 3.99a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.41-1.41L11 12.59V4a1 1 0 0 1 1-1Zm-7 14a1 1 0 0 1 1 1v1h12v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z"
                />
              </svg>
            </span>
            <p className="text-sm font-medium text-[color:var(--color-text)]">{statusText}</p>
            <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">
              Accepted: JPG, PNG, WEBP. Max size: 10MB.
            </p>
            <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">Press Enter or Space to browse files.</p>
          </div>
        )}
      </label>
    </div>
  )
})
