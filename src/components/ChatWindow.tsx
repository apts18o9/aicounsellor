import type { Message } from '../types';

interface Props {
  messages: Message[];
}

export default function ChatWindow({ messages }: Props) {
  return (
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
    </div>
  );
}
