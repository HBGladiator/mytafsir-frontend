import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF first.");
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('✅ PDF uploaded and processed!');
      } else {
        alert('❌ Failed to upload PDF.');
      }
    } catch (error) {
      alert('🚫 Backend not reachable.');
    }
    setLoading(false);
  };

  const handleAsk = async () => {
    if (!question.trim()) return alert("Please enter a question.");
    const formData = new FormData();
    formData.append('question', question);

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setAnswer(data.answer || 'No answer found.');
    } catch (error) {
      alert('🚫 Error asking the question.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6">🕌 MyTafsir PDF Q&A</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md space-y-4">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full"
        />
        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Upload PDF
        </button>

        <input
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border rounded p-2"
        />
        <button
          onClick={handleAsk}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
        >
          Ask Question
        </button>

        {loading && <p className="text-blue-500">⏳ Processing...</p>}
        {answer && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <strong className="block mb-2">Answer:</strong>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </main>
  );
}