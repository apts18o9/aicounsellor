import { useState } from "react";
import type { Message } from '../types';

interface Props {
  messages: Message[];
  loading: boolean;
  sessionId: string;
  sessionTitle: string;
  onTitleUpdate: (newTitle: string) => void;
}

export default function ChatWindow({
  messages,
  loading,
  sessionId,
  sessionTitle,
  onTitleUpdate,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(sessionTitle);

  // Keep local title in sync with sessionTitle prop
  // (in case parent updates after mutation)
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
      <div className="mb-4 flex items-center">
        {editing ? (
          <>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="border p-1 rounded mr-2"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="px-2 py-1 bg-blue-500 text-white rounded"
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
            <h2 className="text-lg font-bold mr-2">{sessionTitle}</h2>
            <button
              onClick={() => setEditing(true)}
              className="px-2 py-1 bg-gray-200 rounded"
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
              className={`p-4 rounded-xl max-w-lg shadow-sm
                ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}
            >
              <p>{msg.text}</p>
              <span className={`block mt-1 text-xs ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
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