import { supabaseClient } from '../../lib/supabaseClient'

const LISTING_INPUTS_BUCKET = 'listing-inputs'

function createInputObjectPath(userId: string, fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? 'jpg'
  const safeExtension = extension.replace(/[^a-z0-9]/g, '') || 'jpg'
  return `${userId}/${crypto.randomUUID()}.${safeExtension}`
}

export const listingApi = {
  list: async () => Promise.resolve([]),
  uploadInputImage: async (userId: string, file: File) => {
    const objectPath = createInputObjectPath(userId, file.name)

    const { error: uploadError } = await supabaseClient.storage
      .from(LISTING_INPUTS_BUCKET)
      .upload(objectPath, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`)
    }

    const { data } = supabaseClient.storage.from(LISTING_INPUTS_BUCKET).getPublicUrl(objectPath)

    if (!data.publicUrl) {
      throw new Error('Image upload failed: missing public URL.')
    }

    return data.publicUrl
  },
}
