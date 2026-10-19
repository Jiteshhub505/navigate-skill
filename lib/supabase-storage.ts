import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create Supabase client with service role key for storage operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = 'course';

/**
 * Upload an image file to Supabase storage
 * @param file - The file to upload
 * @param path - The path within the bucket (e.g., 'categories/image.jpg')
 * @returns The public URL of the uploaded file
 */
export async function uploadImage(
    file: File | Blob,
    path: string
): Promise<{ url: string; error?: string }> {
    try {
        const { data, error } = await supabaseAdmin.storage
            .from(BUCKET_NAME)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: true,
            });

        if (error) {
            console.error('Upload error:', error);
            return { url: '', error: error.message };
        }

        // Get public URL
        const { data: publicUrlData } = supabaseAdmin.storage
            .from(BUCKET_NAME)
            .getPublicUrl(data.path);

        return { url: publicUrlData.publicUrl };
    } catch (error) {
        console.error('Upload exception:', error);
        return { url: '', error: String(error) };
    }
}

/**
 * Delete an image from Supabase storage
 * @param path - The path of the file to delete
 */
export async function deleteImage(path: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabaseAdmin.storage.from(BUCKET_NAME).remove([path]);

        if (error) {
            console.error('Delete error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Delete exception:', error);
        return { success: false, error: String(error) };
    }
}

/**
 * Get public URL for an existing file in storage
 * @param path - The path of the file
 */
export function getPublicUrl(path: string): string {
    const { data } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(path);
    return data.publicUrl;
}

/**
 * List all files in a folder
 * @param folderPath - The folder path to list files from
 */
export async function listFiles(folderPath: string) {
    try {
        const { data, error } = await supabaseAdmin.storage.from(BUCKET_NAME).list(folderPath);

        if (error) {
            console.error('List files error:', error);
            return { files: [], error: error.message };
        }

        return { files: data, error: null };
    } catch (error) {
        console.error('List files exception:', error);
        return { files: [], error: String(error) };
    }
}

/**
 * Extract file path from Supabase storage URL
 * @param url - The full Supabase storage URL
 */
export function extractPathFromUrl(url: string): string {
    try {
        const urlParts = url.split(`/storage/v1/object/public/${BUCKET_NAME}/`);
        return urlParts[1] || '';
    } catch {
        return '';
    }
}
