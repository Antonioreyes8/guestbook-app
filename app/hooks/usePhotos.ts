import { useState, useEffect } from "react";
import { Photo, fetchPhotosFromSupabase, uploadPhotoToSupabase } from "../../lib/photos";

/**
 * Custom hook to manage photo upload state and actions.
 */
export function usePhotos() {
  const [file, setFile] = useState<File | null>(null); // selected file
  const [photos, setPhotos] = useState<Photo[]>([]); // list of fetched photos
  const [loading, setLoading] = useState(false); // loading state for uploads
  const [message, setMessage] = useState<string>(""); // message input

  /**
   * Fetch photos from Supabase and save to state
   */
  const fetchPhotos = async () => {
    try {
      const data = await fetchPhotosFromSupabase();
      setPhotos(data); // update state
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  /**
   * Uploads selected photo and message to Supabase
   */
  const uploadPhoto = async () => {
    if (!file) return; // nothing to upload

    setLoading(true); // disable button while uploading
    try {
      await uploadPhotoToSupabase(file, message);
      setFile(null); // reset file input
      setMessage(""); // reset message input
      fetchPhotos(); // refresh gallery
    } catch (error: any) {
      alert(error.message); // show error to user
    } finally {
      setLoading(false); // re-enable button
    }
  };

  // Fetch photos once when component mounts
  useEffect(() => {
    fetchPhotos();
  }, []);

  return { file, setFile, photos, loading, message, setMessage, uploadPhoto };
}
