import { useState } from 'react';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  const handleUpload = async () => {
    if (!file) return alert('Please select a PDF.');
    const formData = new FormData();
    formData.append('file', file);
    setStatus('Uploading...');

    try {
      const res = await fetch('https://mytafsir-backend.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) setStatus('✅ PDF uploaded and processed!');
      else setStatus('❌ Upload failed.');
    } catch {
      setStatus('🚫 Backend not reachable.');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Upload a PDF</h1>
      <div className="bg-white p-6 rounded shadow space-y-4 w-full max-w-md">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full"
        />
        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
        >
          Upload
        </button>
        {status && <p className="text-center text-gray-700">{status}</p>}
      </div>
    </main>
  );
}