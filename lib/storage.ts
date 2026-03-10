import { createClient } from '@supabase/supabase-js'

// Check if Supabase is available
const isSupabaseAvailable = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')
}

const supabase = isSupabaseAvailable() ? createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
) : null

export async function uploadImage(file: File, userId: string): Promise<string> {
  try {
    // If Supabase is not available, return a mock URL
    if (!supabase) {
      console.log('Supabase not available, using mock image URL')
      // Create a local object URL for the image
      return URL.createObjectURL(file)
    }

    // Generate a unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('classification-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw error
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('classification-images')
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    // Fallback to local object URL
    console.log('Falling back to local image URL')
    return URL.createObjectURL(file)
  }
}

export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // If Supabase is not available, just log and return
    if (!supabase) {
      console.log('Supabase not available, skipping image deletion')
      return
    }

    // Extract file path from URL
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/')
    const fileName = pathParts[pathParts.length - 2] + '/' + pathParts[pathParts.length - 1]
    
    // Delete from Supabase storage
    const { error } = await supabase.storage
      .from('classification-images')
      .remove([fileName])

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    // Don't throw error for deletion failures - just log
  }
}
