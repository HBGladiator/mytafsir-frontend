import { useState } from 'react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF first.");
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await fetch('https://mytafsir-backend.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('✅ PDF uploaded and processed!');
      } else {
        alert('❌ Failed to upload PDF.');
      }
    } catch {
      alert('🚫 Backend not reachable.');
    }
    setLoading(false);
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    const formData = new FormData();
    formData.append('question', question);

    const userMessage: Message = { sender: 'user', text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch('https://mytafsir-backend.onrender.com/ask', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const aiMessage: Message = { sender: 'ai', text: data.answer || 'No answer found.' };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const errorMsg: Message = { sender: 'ai', text: '🚫 Error asking the question.' };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-between">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg mt-6 mb-4 p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">📖 MyTafsir AI Q&A</h1>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="flex-1 border p-2 rounded"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
          >
            Upload
          </button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-3xl overflow-y-auto bg-white rounded-lg shadow p-4 space-y-4 mb-4 max-h-[60vh]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-xs ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 px-4 py-2 rounded-xl max-w-xs text-gray-500 italic">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-4 flex items-center space-x-2 sticky bottom-0">
        <input
          type="text"
          placeholder="Type your question..."
          className="flex-1 border p-2 rounded"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
        />
        <button
          onClick={handleAsk}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
        >
          Ask
        </button>
      </div>
    </div>
  );
}