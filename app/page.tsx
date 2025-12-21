"use client"; 
// Ensures this component is rendered on the client.
// Required because this page uses state, event handlers,
// and client-side hooks.

import { useState } from "react"; // React hook for local UI state
import Heading from "./components/heading"; // Page header component
import Gallery from "./components/gallery"; // Displays uploaded photos
import Form from "./components/form"; // Upload form component
import { usePhotos } from "./hooks/usePhotos"; // Custom hook for photo logic

/**
 * Home page component for the guestbook application.
 *
 * Responsibilities:
 * - Display the page heading
 * - Render the photo gallery
 * - Toggle and render the upload form
 * - Connect UI components to the photo data layer (usePhotos)
 */
export default function Home() {
  // Destructure state and actions from the custom hook
  const {
    file,        // Currently selected file for upload
    setFile,     // Setter for selected file
    photos,      // Array of photos loaded from Supabase
    loading,     // Upload loading state
    message,     // Current message input
    setMessage,  // Setter for message input
    uploadPhoto, // Upload handler
    handleLike,  // Like handler
    loadMore,    // Load next page of photos
    hasMore,     // Whether more photos exist
  } = usePhotos();

  // Controls whether the upload form is visible
  const [showForm, setShowForm] = useState(false);

  /**
   * Wrap uploadPhoto so we can also close the form
   * after a successful upload.
   */
  const handleUploadAndClose = async () => {
    await uploadPhoto();
    setShowForm(false);
  };

  return (
    <main className="MainContainer">
      {/* Page heading */}
      <Heading />

      {/* Photo gallery */}
      <Gallery
        photos={photos}
        onLike={handleLike}
        hasMore={hasMore}
        loadMore={loadMore}
      />

      {/* Floating Add Post Button */}
      {/* Black circle with white "+" */}
      <button
        className="add-post-btn"
        onClick={() => setShowForm((prev) => !prev)}
        aria-label="Add new post"
      >
        +
      </button>

      {/* Upload form (conditionally rendered) */}
      {showForm && (
        <Form
          file={file}
          setFile={setFile}
          message={message}
          setMessage={setMessage}
          uploadPhoto={handleUploadAndClose}
          loading={loading}
        />
      )}
    </main>
  );
}