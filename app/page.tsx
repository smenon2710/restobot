'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAsk = async () => {
    if (!query.trim()) return;

    const classifyRes = await fetch('/api/classify', {
      method: 'POST',
      body: JSON.stringify({ query }),
      headers: { 'Content-Type': 'application/json' },
    });

    const { isRestaurantRelated, debug } = await classifyRes.json();

    console.log('%c[Restobot Classifier Debug]', 'color: orange; font-weight: bold;');
    console.log('Prompt sent to OpenAI:\n', debug.prompt);
    console.log('Model response:\n', debug.modelResponse);
    console.log('Classifier Output:', isRestaurantRelated);

    // Proceed regardless of classification
    const newMessages: Message[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setQuery('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: newMessages, classifierHint: isRestaurantRelated }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    setMessages([...newMessages, { role: 'assistant', content: data.answer }]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      {/* Banner */}
      <div className="sticky top-0 z-50 bg-gray-900 px-4 py-2 shadow-md border-b border-gray-700">
        <Image
          src="/restobot-banner.png"
          alt="Restobot Logo"
          width={672}
          height={160}
          className="mx-auto rounded-lg drop-shadow"
        />
      </div>

      {/* Chat area */}
      <main className="flex-grow p-6 max-w-2xl mx-auto w-full overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`whitespace-pre-wrap max-w-[75%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'ml-auto bg-teal-600 text-white'
                  : 'mr-auto bg-slate-800 text-gray-100'
              }`}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div className="mr-auto bg-slate-800 text-gray-300 px-3 py-2 rounded-lg italic">
              Thinking...
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input area */}
      <div className="sticky bottom-0 bg-gray-900 pt-4 pb-6 px-6 border-t border-gray-700">
        <div className="max-w-2xl mx-auto flex gap-2">
          <textarea
            ref={inputRef}
            className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded text-white resize-none"
            rows={2}
            placeholder="Ask me about restaurants..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            onClick={handleAsk}
            className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading || !query.trim()}
          >
            Send
          </button>
        </div>
      </div>

      {/* Floating toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
