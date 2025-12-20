"use client"; // Next.js directive: this component is rendered on the client (browser)

/**
 * Home page component for the guestbook application.
 * 
 * Features:
 * - Upload images to Supabase Storage.
 * - Add an optional message for each image.
 * - Display a gallery of uploaded photos with likes and messages.
 * - Increment likes with real-time UI updates and persistent storage.
 */

import Heading from "./sections/heading"; // Header component for the page
import Gallery from "./sections/gallery"; // Gallery component to display uploaded photos
import { usePhotos } from "./hooks/usePhotos"; // Custom hook managing photos, uploads, messages, and likes

export default function Home() {
  // Destructure the state and actions from the custom hook
  const {
    file,          // Currently selected file
    setFile,       // Setter for the selected file
    photos,        // Array of photos fetched from Supabase
    loading,       // Boolean indicating if an upload is in progress
    message,       // Message input for the selected photo
    setMessage,    // Setter for the message input
    uploadPhoto,   // Function to handle uploading a photo + message
    handleLike,    // Function to handle incrementing likes on a photo
  } = usePhotos();

  return (
    <main className="MainContainer">
      {/* Page Heading */}
      <Heading />

      {/* File input: allows the user to select an image from their device */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)} // Update the selected file in state
      />

      {/* Text input: allows the user to optionally add a message for the photo */}
      <input
        type="text"
        placeholder="Add a message"
        value={message} // Controlled input bound to state
        onChange={(e) => setMessage(e.target.value)} // Update message state on input
        style={{ marginRight: 10, padding: "4px 8px" }} // Basic inline styling for spacing
      />

      {/* Upload button */}
      <button onClick={uploadPhoto} disabled={loading}>
        {/* Display loading state while upload is in progress */}
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* Gallery component: displays all photos with their messages, dates, and likes */}
      <Gallery photos={photos} onLike={handleLike} />
    </main>
  );
}