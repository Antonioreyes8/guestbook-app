"use client"; // Next.js directive: this component is rendered in the browser

/**
 * Home page component for the guestbook application.
 *
 * Features:
 * - Upload images to Supabase Storage.
 * - Add an optional message for each image.
 * - Display a gallery of uploaded photos with messages, dates, and likes.
 * - Increment likes with real-time UI updates and persistent storage.
 * - Floating “Add Post” button to toggle the upload form.
 */

import { useState } from "react"; // React state hook
import Heading from "./components/heading"; // Page header
import Gallery from "./components/gallery"; // Gallery for displaying photos
import Form from "./components/form"; // Form component for uploading a new photo
import { usePhotos } from "./hooks/usePhotos"; // Custom hook managing photo state and actions

export default function Home() {
  // Destructure all state variables and actions from the custom hook
  const {
    file,        // Currently selected file
    setFile,     // Setter for file selection
    photos,      // Array of photo objects from Supabase
    loading,     // Boolean: true while a photo is uploading
    message,     // Current message for the photo
    setMessage,  // Setter for message
    uploadPhoto, // Function to upload photo + message
    handleLike,  // Function to handle likes increment
  } = usePhotos();

  // State for toggling the visibility of the upload form
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="MainContainer">
      {/* Page heading at the top */}
      <Heading />

      {/* Gallery of uploaded photos */}
      <Gallery photos={photos} onLike={handleLike} />

      {/* Floating Add Post Button */}
      {/* Clicking toggles the visibility of the upload form */}
      <button
        className="add-post-btn" // CSS class for black circle + white plus
        onClick={() => setShowForm(!showForm)}
        aria-label="Add new post" // Accessibility label
      >
        +
      </button>

      {/* Conditional rendering of the form */}
      {/* Only shown when showForm is true */}
      {showForm && (
        <Form
          file={file}           // Pass current selected file
          setFile={setFile}     // Pass file setter
          message={message}     // Pass current message
          setMessage={setMessage} // Pass message setter
          uploadPhoto={uploadPhoto} // Pass upload function
          loading={loading}     // Pass loading state for button disabling
        />
      )}
    </main>
  );
}