import { supabase } from "./supabase";

// Type definition for a photo row in Supabase
export type Photo = {
  id: string;
  image_url: string;
  message?: string;
  created_at: string | null;
};

/**
 * Uploads a photo file to Supabase Storage and inserts a record into the DB.
 * @param file - The image file to upload
 * @param message - Optional message to store with the photo
 * @returns The public URL of the uploaded image
 */
export async function uploadPhotoToSupabase(file: File, message: string) {
  // Create a unique filename to prevent overwriting
  const fileName = `${Date.now()}-${file.name}`;

  // Upload file to the "photos" bucket
  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(fileName, file);

  if (uploadError) throw new Error(uploadError.message);

  // Get the public URL of the uploaded file
  const { data } = supabase.storage.from("photos").getPublicUrl(fileName);

  // Insert a new row into the "guestbook" table with image URL and message
  const { error: insertError } = await supabase.from("guestbook").insert({
    image_url: data.publicUrl,
    message,
  });

  if (insertError) throw new Error(insertError.message);

  return data.publicUrl; // return the public URL
}

/**
 * Fetches all photos from the "guestbook" table.
 * @returns Array of Photo objects
 */
export async function fetchPhotosFromSupabase(): Promise<Photo[]> {
  const { data, error } = await supabase
    .from("guestbook")
    .select("id, image_url, message, created_at") // include timestamp
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data ?? [];
}