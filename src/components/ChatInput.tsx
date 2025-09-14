import React from 'react';

type ChatInputProps = {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<Element>) => void;
  isLoading: boolean;
};

export default function ChatInput({ input, setInput, handleSubmit, isLoading }: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        disabled={isLoading}
        className="flex-grow p-2 border rounded"
        placeholder="Type your message..."
      />
      <button type="submit" disabled={isLoading} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}