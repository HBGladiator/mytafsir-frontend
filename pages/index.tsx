import { useState } from 'react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export default function Chat() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage: Message = { sender: 'user', text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    const formData = new FormData();
    formData.append('question', userMessage.text);

    try {
      const res = await fetch('https://mytafsir-backend.onrender.com/ask', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const aiMessage: Message = { sender: 'ai', text: data.answer || 'No answer found.' };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const errorMessage: Message = { sender: 'ai', text: '🚫 Error asking the question.' };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-lg ${
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

      <div className="p-4 bg-white border-t flex items-center space-x-2">
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
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
        >
          Ask
        </button>
      </div>
    </div>
  );
}