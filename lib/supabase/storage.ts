import { createClient } from './client'

export async function uploadImage(file: File, bucket: string = 'course') {
    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

    if (uploadError) {
        throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

    return publicUrl
}

export async function deleteImage(url: string, bucket: string = 'course') {
    const supabase = createClient()

    // Extract file path from public URL
    // Example URL: https://xxx.supabase.co/storage/v1/object/public/course/filename.jpg
    const parts = url.split('/')
    const fileName = parts[parts.length - 1]

    if (!fileName) return

    const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName])

    if (error) {
        console.error('Error deleting image:', error)
    }
}
