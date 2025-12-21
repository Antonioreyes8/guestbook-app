"use client";

import "../styles/form.css";

type FormProps = {
  file: File | null;
  setFile: (file: File | null) => void;
  message: string;
  setMessage: (msg: string) => void;
  uploadPhoto: () => Promise<void>;
  loading: boolean;
};

export default function Form({ file, setFile, message, setMessage, uploadPhoto, loading }: FormProps) {
  return (
    <div className="add-post-form">
      {/* File input */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      {/* Message input */}
      <input
        type="text"
        placeholder="Add a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* Upload button */}
      <button onClick={uploadPhoto} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
