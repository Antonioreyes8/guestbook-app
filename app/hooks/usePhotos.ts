import { useState, useEffect } from "react";
import {
  Photo,
  fetchPhotosFromSupabase,
  uploadPhotoToSupabase,
  likePhoto,
} from "../../lib/photos";

/**
 * Custom React hook to manage guestbook photo functionality.
 * 
 * Responsibilities:
 * 1. Handle selection of image files.
 * 2. Upload photos to Supabase Storage.
 * 3. Add optional messages for each photo.
 * 4. Fetch all photos from the Supabase database.
 * 5. Handle likes for each photo with optimistic UI updates.
 */
export function usePhotos() {
  // -----------------------------
  // State variables
  // -----------------------------
  const [file, setFile] = useState<File | null>(null); // Currently selected file for upload
  const [photos, setPhotos] = useState<Photo[]>([]);   // List of photos fetched from Supabase
  const [loading, setLoading] = useState(false);       // Tracks upload progress
  const [message, setMessage] = useState<string>("");  // User input message for the photo

  // -----------------------------
  // Fetch all photos from Supabase
  // -----------------------------
  const fetchPhotos = async () => {
    try {
      const data = await fetchPhotosFromSupabase(); // Query Supabase for all photos
      setPhotos(data);                               // Update state with fetched photos
    } catch (error) {
      console.error("Error fetching photos:", error); // Log any errors for debugging
    }
  };

  // -----------------------------
  // Upload a photo and message
  // -----------------------------
  const uploadPhoto = async () => {
    if (!file) return;          // No file selected, do nothing
    setLoading(true);           // Disable upload button while in progress

    try {
      await uploadPhotoToSupabase(file, message); // Upload to Supabase
      setFile(null);          // Reset file input
      setMessage("");         // Reset message input
      fetchPhotos();          // Refresh gallery after upload
    } catch (error: any) {
      alert(error.message);   // Notify user if upload fails
    } finally {
      setLoading(false);      // Re-enable upload button
    }
  };

  // -----------------------------
  // Handle liking a photo
  // -----------------------------
  const handleLike = async (photoId: string) => {
    // Optimistically update UI: immediately increment likes in state
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === photoId ? { ...photo, likes: photo.likes + 1 } : photo
      )
    );

    try {
      await likePhoto(photoId); // Increment likes in Supabase via RPC
    } catch (error) {
      console.error("Error liking photo:", error); // Log errors

      // Rollback UI if Supabase update fails
      setPhotos((prev) =>
        prev.map((photo) =>
          photo.id === photoId ? { ...photo, likes: photo.likes - 1 } : photo
        )
      );
    }
  };

  // -----------------------------
  // Effect: Fetch photos once on mount
  // -----------------------------
  useEffect(() => {
    fetchPhotos(); // Initial fetch when the component loads
  }, []);

  // -----------------------------
  // Return state and actions
  // -----------------------------
  return {
    file,         // Selected file
    setFile,      // Setter for file
    photos,       // Current photo list
    loading,      // Upload loading state
    message,      // Message input
    setMessage,   // Setter for message input
    uploadPhoto,  // Function to upload photo
    handleLike,   // Function to handle likes
  };
}
