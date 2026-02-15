import { useEffect, useMemo, useState } from 'react'

import { cn } from '../../../lib/utils'
import { Skeleton } from '../../../components/ui/Skeleton'
import { createListingThumbnailDataUrl } from './listingVisuals'

type ListingThumbnailProps = {
  title: string
  subtitle: string
  alt: string
  src?: string | null
  showFallbackLabel?: boolean
  className?: string
  imageClassName?: string
}

export function ListingThumbnail({
  title,
  subtitle,
  alt,
  src,
  showFallbackLabel = false,
  className,
  imageClassName,
}: ListingThumbnailProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSourceUnavailable, setIsSourceUnavailable] = useState(false)
  const generatedSrc = useMemo(
    () => createListingThumbnailDataUrl({ title, subtitle }),
    [subtitle, title],
  )
  const displaySrc = src ?? generatedSrc
  const fallbackLabel = !src ? 'No image' : isSourceUnavailable ? 'Image unavailable' : null

  useEffect(() => {
    setIsLoaded(false)
    setIsSourceUnavailable(false)
  }, [displaySrc])

  return (
    <div className={cn('relative overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]', className)}>
      {!isLoaded ? <Skeleton className="absolute inset-0 h-full w-full rounded-none" /> : null}
      <img
        src={displaySrc}
        alt={alt}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          imageClassName,
        )}
        onLoad={() => setIsLoaded(true)}
        onError={(event) => {
          if (event.currentTarget.src !== generatedSrc) {
            setIsSourceUnavailable(true)
            event.currentTarget.src = generatedSrc
            return
          }

          setIsLoaded(true)
        }}
      />
      {showFallbackLabel && fallbackLabel ? (
        <span className="pointer-events-none absolute left-3 top-3 rounded-xl border border-[color:color-mix(in_srgb,var(--color-surface)_70%,var(--color-border)_30%)] bg-[color:color-mix(in_srgb,var(--color-surface)_93%,transparent_7%)] px-2 py-1 text-[11px] font-semibold text-[color:var(--color-text-muted)] backdrop-blur">
          {fallbackLabel}
        </span>
      ) : null}
    </div>
  )
}
