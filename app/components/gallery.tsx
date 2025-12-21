"use client"; 
// Tells Next.js this component must run in the browser.
// Required because this component uses event handlers (onClick)
// and client-side interactivity.

import "../styles/gallery.css"; 
// Import gallery-specific styles

import { Photo } from "../../lib/photos"; 
// Import the shared Photo type so props stay consistent
// across the app (prevents type mismatches)

/**
 * Props accepted by the Gallery component
 */
type GalleryProps = {
  photos: Photo[];              // Array of photo objects to render
  onLike: (id: string) => void; // Callback to increment likes for a photo
  hasMore: boolean;             // Whether more photos exist in the database
  loadMore: () => void;         // Function to load the next batch of photos
};

/**
 * Gallery Component
 *
 * Responsibilities:
 * - Display a grid/list of photo posts
 * - Show image, message, date, and likes
 * - Allow users to like photos
 * - Support lazy image loading
 * - Render a "Load more" button when more photos exist
 */
export default function Gallery({
  photos,
  onLike,
  hasMore,
  loadMore,
}: GalleryProps) {
  return (
    <section className="gallery">
      {/* 
        Loop over each photo and render a gallery item.
        React requires a unique `key` for list items — we use photo.id.
      */}
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="galleryitems"
        >
          {/* 
            Photo image
            - `loading="lazy"` delays loading until the image is near viewport
            - This improves performance when many images exist
          */}
          <img
            src={photo.image_url}
            alt="Guestbook upload"
            loading="lazy"
          />

          {/* 
            Optional message
            - Only rendered if message exists
            - Prevents empty spacing for posts without text
          */}
          {photo.message && (
            <p className="gallery-message">
              {photo.message}
            </p>
          )}

          {/* 
            Display formatted creation date
            - Supabase timestamps are UTC
            - Adding "Z" ensures correct timezone parsing
            - Fallback text is shown if date is missing
          */}
          <p className="gallery-date">
            {photo.created_at
              ? new Date(photo.created_at + "Z").toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )
              : "No date"}
          </p>

          {/* 
            Like button
            - Optimistically updates UI
            - Calls parent handler to persist change in Supabase
          */}
          <button
            className="like-button"
            onClick={() => onLike(photo.id)}
            aria-label="Like photo"
          >
            ♡︎ {photo.likes}
          </button>
        </div>
      ))}

      {/* 
        Load More button
        - Only rendered if there are more photos to fetch
        - Appends new photos to the END of the list (no page reload)
      */}
      {hasMore && (
        <button
          className="load-more-button"
          onClick={loadMore}
        >
          Load more
        </button>
      )}
    </section>
  );
}