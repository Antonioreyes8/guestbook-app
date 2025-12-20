"use client"; 
// This tells Next.js that this file runs in the browser (client-side rendering)

import Heading from "./sections/heading"; // Page heading component
import Gallery from "./sections/gallery"; // Photo gallery component
import { usePhotos } from "./hooks/usePhotos"; // Custom hook for photo logic

/**
 * Home page component
 */
export default function Home() {
  // Destructure state & actions from our custom hook
  const { file, setFile, photos, loading, message, setMessage, uploadPhoto } = usePhotos();

  return (
    <main className="MainContainer">
      {/* Heading section */}
      <Heading />

      {/* File input for selecting an image */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)} // update selected file
      />

      {/* Text input for optional message */}
      <input
        type="text"
        placeholder="Add a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)} // update message state
        style={{ marginRight: 10, padding: "4px 8px" }}
      />

      {/* Upload button */}
      <button onClick={uploadPhoto} disabled={loading}>
        {loading ? "Uploading..." : "Upload"} {/* Show uploading state */}
      </button>

      {/* Gallery of uploaded photos */}
      <Gallery photos={photos} />
    </main>
  );
}