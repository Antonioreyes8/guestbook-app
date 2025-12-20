"use client"; // Next.js directive: this component is rendered on the client (browser)

/**
 * Gallery component to display a list of uploaded photos in the guestbook.
 * 
 * Features:
 * - Shows the photo image.
 * - Displays optional message for each photo.
 * - Formats and displays the creation date.
 * - Displays a like button that can be clicked to increment likes.
 */

import "../styles/gallery.css"; // CSS styling for the gallery
import { Photo } from "../../lib/photos"; // Type definition for photo objects

// Props definition for the Gallery component
type GalleryProps = {
  photos: Photo[];            // Array of photos to display
  onLike: (id: string) => void; // Function to handle liking a photo
};

export default function Gallery({ photos, onLike }: GalleryProps) {
  return (
    <section className="gallery">
      {/* Loop over each photo and render its content */}
      {photos.map((photo) => (
        <div
          key={photo.id} // Unique key for React list rendering
          style={{ display: "inline-block", textAlign: "center" }} // Basic layout for gallery items
        >
          {/* Photo image */}
          <img src={photo.image_url} alt="Guestbook upload" />

          {/* Optional message displayed below the photo */}
          {photo.message && (
            <p style={{ marginTop: 5, fontSize: 24 }}>{photo.message}</p>
          )}

          {/* Formatted creation date */}
          <p style={{ marginTop: 2, fontSize: 24, color: "#666" }}>
            {photo.created_at
              ? new Date(photo.created_at + "Z").toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }) // Format: "Jan 1, 2025"
              : "No date"} {/* Fallback if created_at is missing */}
          </p>

          {/* Like button */}
          <button
            style={{ marginTop: 5, fontSize: 16, cursor: "pointer" }}
            onClick={() => onLike(photo.id)} // Call the parent handler when clicked
          >
            ❤️ {photo.likes} {/* Display current number of likes */}
          </button>
        </div>
      ))}
    </section>
  );
}
