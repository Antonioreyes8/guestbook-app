"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Photo = {
  id: string;
  image_url: string;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  async function uploadPhoto() {
    if (!file) return;

    setLoading(true);

    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(fileName, file);

    if (uploadError) {
      alert(uploadError.message);
      setLoading(false);
      return;
    }

    const { data } = supabase.storage
      .from("photos")
      .getPublicUrl(fileName);

    const { error: insertError } = await supabase
      .from("guestbook")
      .insert({ image_url: data.publicUrl });

    if (insertError) {
      alert(insertError.message);
    }

    setFile(null);
    setLoading(false);
    fetchPhotos();
  }

  async function fetchPhotos() {
    const { data, error } = await supabase
      .from("guestbook")
      .select("id, image_url")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPhotos(data ?? []);
  }

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>📸 Guestbook</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={uploadPhoto} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      <div style={{ marginTop: 20 }}>
        {photos.map((p) => (
          <img
            key={p.id}
            src={p.image_url}
            style={{ width: 200, margin: 10 }}
          />
        ))}
      </div>
    </main>
  );
}