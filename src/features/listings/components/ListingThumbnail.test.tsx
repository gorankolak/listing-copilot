import { fireEvent, render, screen } from '@testing-library/react'

import { ListingThumbnail } from './ListingThumbnail'

describe('ListingThumbnail', () => {
  it('keeps remote image visible after load and does not flip to unavailable label', () => {
    render(
      <ListingThumbnail
        title="Compact Bookshelf Speakers"
        subtitle="€100 - €250"
        alt="Listing image"
        src="https://example.com/image.jpg"
        showFallbackLabel
      />,
    )

    const image = screen.getByRole('img', { name: 'Listing image' })
    fireEvent.load(image)

    expect(screen.queryByText('Image unavailable')).not.toBeInTheDocument()
  })

  it('shows unavailable label when remote image fails to load', () => {
    render(
      <ListingThumbnail
        title="Compact Bookshelf Speakers"
        subtitle="€100 - €250"
        alt="Listing image"
        src="https://example.com/image.jpg"
        showFallbackLabel
      />,
    )

    const image = screen.getByRole('img', { name: 'Listing image' })
    fireEvent.error(image)

    expect(screen.getByText('Image unavailable')).toBeInTheDocument()
  })
})
