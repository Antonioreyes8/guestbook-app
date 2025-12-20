"use client";

import "../styles/gallery.css";

// Update Photo type to include message
type Photo = {
	id: string;
	image_url: string;
	message?: string;
	created_at: string;
};

type GalleryProps = {
	photos: Photo[];
};

export default function Gallery({ photos }: GalleryProps) {
	return (
		<section className="gallery">
			{photos.map((photo) => (
				<div
					key={photo.id}
					style={{ display: "inline-block", textAlign: "center" }}
				>
					<img src={photo.image_url} alt="Guestbook upload" />
					{/* Show message if it exists */}
					{photo.message && <p style={{ marginTop: 5, fontSize: 24 }}>{photo.message}</p>}

					{/* Show formatted date */}
					<p style={{ marginTop: 2, fontSize: 24}}>
						{photo.created_at
							? new Date(photo.created_at + "Z").toLocaleDateString(undefined, {
									year: "numeric",
									month: "short",
									day: "numeric",
							  })
							: "No date"}
					</p>
				</div>
			))}
		</section>
	);
}
