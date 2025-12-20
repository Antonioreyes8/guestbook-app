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
 * - If storage upload fails, throws an error with the message from Supabase.
 * - If DB insertion fails, throws an error with the message from Supabase.
 * 
 * @param file - The image file selected by the user.
 * @param message - Optional message provided by the user.
 * @returns The public URL of the uploaded image for immediate use in the UI.
 */
export async function uploadPhotoToSupabase(file: File, message: string) {
  // Step 1: Generate a unique filename to prevent collisions
  const fileName = `${Date.now()}-${file.name}`;

  // Step 2: Upload the file to the "photos" bucket
  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(fileName, file);

  if (uploadError) throw new Error(uploadError.message);

  // Step 3: Retrieve the public URL for the uploaded image
  const { data } = supabase.storage.from("photos").getPublicUrl(fileName);

  // Step 4: Insert a new row into the guestbook table
  const { error: insertError } = await supabase.from("guestbook").insert({
    image_url: data.publicUrl,
    message,
    likes: 0, // initialize likes to zero for new photos
  });

  if (insertError) throw new Error(insertError.message);

  // Return the public URL so the frontend can immediately display the photo
  return data.publicUrl;
}

/**
 * Fetches all photo records from the Supabase `guestbook` table.
 * 
 * The photos are sorted in descending order based on their creation timestamp,
 * so the newest photos appear first.
 * 
 * Error handling:
 * - Throws an error if the Supabase query fails.
 * 
 * @returns Array of `Photo` objects containing all necessary info for display.
 */
export async function fetchPhotosFromSupabase(): Promise<Photo[]> {
  const { data, error } = await supabase
    .from("guestbook")
    .select("id, image_url, message, created_at, likes") // include all necessary columns
    .order("created_at", { ascending: false }); // newest first

  if (error) throw new Error(error.message);

  return data ?? []; // return empty array if no photos
}

/**
 * Atomically increments the `likes` count of a photo using a Supabase RPC function.
 * 
 * This ensures that multiple users liking the same photo at the same time
 * do not overwrite each other’s updates.
 * 
 * Steps:
 * 1. Calls the `increment_likes` RPC in Supabase, passing the photo ID.
 * 2. RPC increments the `likes` column by 1.
 * 
 * Error handling:
 * - Throws an error if the RPC fails for any reason.
 * 
 * @param photoId - The UUID of the photo to increment likes for.
 */
export async function likePhoto(photoId: string) {
  const { error } = await supabase.rpc("increment_likes", { photo_id: photoId });
  if (error) throw new Error(error.message);
}
