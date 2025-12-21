import { supabase } from "./supabase";

/**
 * Type definition representing a single photo row in the Supabase `guestbook` table.
 * 
 * Fields:
 * - `id`: Unique identifier (UUID) of the photo.
 * - `image_url`: Public URL of the uploaded photo stored in Supabase Storage.
 * - `message` (optional): A user-provided message accompanying the photo.
 * - `created_at`: Timestamp of when the photo was inserted into the database.
 * - `likes`: Number of likes the photo has received. Defaults to 0 on insert.
 */
export type Photo = {
  id: string;
  image_url: string;
  message?: string;
  created_at: string;
  likes: number;
};

/**
 * Uploads a photo file to Supabase Storage and inserts a corresponding row
 * into the `guestbook` table with the image URL, optional message, and initial likes.
 * 
 * Steps performed:
 * 1. Generate a unique filename using the current timestamp + original file name.
 * 2. Upload the file to the `photos` bucket in Supabase Storage.
 * 3. Retrieve the public URL of the uploaded file.
 * 4. Insert a new row into the `guestbook` table with:
 *    - `image_url` set to the public URL
 *    - `message` as provided by the user
 *    - `likes` initialized to 0
 * 
 * Error handling:
 * - Throws if storage upload fails.
 * - Throws if database insertion fails.
 * 
 * @param file - The image file selected by the user.
 * @param message - Optional message provided by the user.
 * @returns The public URL of the uploaded image for immediate use in the UI.
 */
export async function uploadPhotoToSupabase(file: File, message: string) {
  // Step 1: Generate a unique filename to prevent overwriting
  const fileName = `${Date.now()}-${file.name}`;

  // Step 2: Upload the file to the "photos" bucket
  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(fileName, file);

  if (uploadError) throw new Error(uploadError.message);

  // Step 3: Get the public URL for the uploaded image
  const { data } = supabase.storage.from("photos").getPublicUrl(fileName);

  // Step 4: Insert a new row in the guestbook table
  const { error: insertError } = await supabase.from("guestbook").insert({
    image_url: data.publicUrl,
    message,
    likes: 0, // initialize likes to 0 for new photos
  });

  if (insertError) throw new Error(insertError.message);

  // Return the public URL for immediate UI display
  return data.publicUrl;
}

/**
 * Fetches a range of photo records from Supabase.
 * 
 * Supports pagination by specifying `from` and `to` indices.
 * Photos are sorted by `created_at` descending (newest first).
 * 
 * Error handling:
 * - Throws if the query fails.
 * 
 * @param from - Start index for pagination (0-based)
 * @param to - End index for pagination (inclusive)
 * @returns Array of `Photo` objects
 */
export async function fetchPhotosFromSupabase(from: number, to: number): Promise<Photo[]> {
  const { data, error } = await supabase
    .from("guestbook")
    .select("id, image_url, message, created_at, likes") // select all necessary columns
    .order("created_at", { ascending: false }) // newest first
    .range(from, to); // pagination

  if (error) throw new Error(error.message);

  return data ?? []; // fallback to empty array if no data
}

/**
 * Atomically increments the `likes` count of a photo using a Supabase RPC.
 * 
 * Ensures multiple users can like the same photo simultaneously
 * without overwriting each other's updates.
 * 
 * Steps:
 * 1. Calls the `increment_likes` RPC in Supabase, passing the photo ID.
 * 2. RPC increments the `likes` column by 1 atomically.
 * 
 * Error handling:
 * - Throws if the RPC call fails.
 * 
 * @param photoId - UUID of the photo to increment likes for
 */
export async function likePhoto(photoId: string) {
  const { error } = await supabase.rpc("increment_likes", { photo_id: photoId });
  if (error) throw new Error(error.message);
}