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
 * 1. Handle image file selection.
 * 2. Upload photos + messages to Supabase.
 * 3. Fetch paginated photos from Supabase.
 * 4. Append photos using "Load more".
 * 5. Increment likes with optimistic UI updates.
 *
 * This hook is designed to scale efficiently (hundreds+ images)
 * without reloading the page or duplicating data.
 */
export function usePhotos() {
  // -----------------------------
  // Configuration
  // -----------------------------
  const PAGE_SIZE = 8; // Number of photos per page fetch

  // -----------------------------
  // State: Upload
  // -----------------------------
  const [file, setFile] = useState<File | null>(null); // Selected image file
  const [message, setMessage] = useState<string>(""); // Optional photo message
  const [loading, setLoading] = useState(false); // Upload loading state

  // -----------------------------
  // State: Gallery / Pagination
  // -----------------------------
  const [photos, setPhotos] = useState<Photo[]>([]); // All loaded photos
  const [page, setPage] = useState(0); // Current page index
  const [hasMore, setHasMore] = useState(true); // Whether more photos exist

  // -----------------------------
  // Fetch photos for a specific page
  // -----------------------------
  const fetchPhotos = async (pageIndex: number, replace = false) => {
    try {
      const from = pageIndex * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const data = await fetchPhotosFromSupabase(from, to);

      // If fewer than PAGE_SIZE were returned, there are no more photos
      if (data.length < PAGE_SIZE) {
        setHasMore(false);
      }

      // Replace or append photos depending on context
      setPhotos((prev) => (replace ? data : [...prev, ...data]));
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  // -----------------------------
  // Load the next page of photos
  // -----------------------------
  const loadMore = () => {
    if (!hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchPhotos(nextPage);
  };

  // -----------------------------
  // Upload a photo and refresh gallery
  // -----------------------------
  const uploadPhoto = async () => {
    if (!file) return;

    setLoading(true);

    try {
      await uploadPhotoToSupabase(file, message);

      // Reset upload inputs
      setFile(null);
      setMessage("");

      // Reset pagination and reload from the beginning
      setPhotos([]);
      setPage(0);
      setHasMore(true);

      fetchPhotos(0, true);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Handle liking a photo (optimistic UI)
  // -----------------------------
  const handleLike = async (photoId: string) => {
    // Optimistically update UI
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === photoId
          ? { ...photo, likes: photo.likes + 1 }
          : photo
      )
    );

    try {
      await likePhoto(photoId); // Atomic increment via Supabase RPC
    } catch (error) {
      console.error("Error liking photo:", error);

      // Roll back UI if update fails
      setPhotos((prev) =>
        prev.map((photo) =>
          photo.id === photoId
            ? { ...photo, likes: photo.likes - 1 }
            : photo
        )
      );
    }
  };

  // -----------------------------
  // Initial load on component mount
  // -----------------------------
  useEffect(() => {
    fetchPhotos(0, true); // Load first page on mount
  }, []);

  // -----------------------------
  // Public API exposed by the hook
  // -----------------------------
  return {
    // Upload state
    file,
    setFile,
    message,
    setMessage,
    loading,

    // Gallery state
    photos,
    hasMore,

    // Actions
    uploadPhoto,
    loadMore,
    handleLike,
  };
}