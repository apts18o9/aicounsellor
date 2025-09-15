import { useState } from "react";
import type { Message } from "../types";

interface Props {
  messages: Message[];
  loading: boolean;
  sessionId: string;
  sessionTitle: string;
  onTitleUpdate: (newTitle: string) => void;
  theme: 'light' | 'dark';
}

export default function ChatWindow({
  messages,
  loading,
  sessionId,
  sessionTitle,
  onTitleUpdate,
  theme,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(sessionTitle);

  if (title !== sessionTitle && !editing) {
    setTitle(sessionTitle);
  }

  const handleSave = () => {
    if (title.trim() && title !== sessionTitle) {
      onTitleUpdate(title.trim());
    }
    setEditing(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex items-center gap-2">
        {editing ? (
          <>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={`border p-1 rounded mr-2 ${theme === 'dark' ? 'bg-gray-900 text-blue-100 border-gray-700' : ''}`}
              autoFocus
            />
            <button
              onClick={handleSave}
              className={`px-2 py-1 ${theme === 'dark' ? 'bg-blue-700' : 'bg-blue-600'} text-white rounded shadow`}
            >
              Save
            </button>
            <button
              onClick={() => { setEditing(false); setTitle(sessionTitle); }}
              className="ml-2 px-2 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h2 className={`text-xl font-bold mr-2 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>{sessionTitle}</h2>
            <button
              onClick={() => setEditing(true)}
              className={`px-2 py-1 bg-gray-200 rounded shadow hover:bg-gray-300 transition ${!sessionId ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!sessionId}
            >
              Edit
            </button>
          </>
        )}
      </div>
      <div className="flex-grow overflow-y-auto space-y-4 pr-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`p-4 rounded-xl max-w-lg shadow
                ${msg.sender === 'user'
                  ? theme === 'dark'
                    ? 'bg-blue-800 text-white rounded-br-none'
                    : 'bg-blue-600 text-white rounded-br-none'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-blue-100 rounded-bl-none border border-gray-600'
                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'}`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              <span className={`block mt-1 text-xs ${msg.sender === 'user' ? (theme === 'dark' ? 'text-blue-300' : 'text-blue-200') : (theme === 'dark' ? 'text-gray-400' : 'text-gray-400')}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-center text-gray-400 py-4">Loading...</div>
        )}
      </div>
    </div>
  );
}