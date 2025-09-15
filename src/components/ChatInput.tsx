import React from "react";

export type ChatInputProps = {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<Element>) => void;
  isPending: boolean;
  theme: 'light' | 'dark';
};

export default function ChatInput({
  input,
  setInput,
  handleSubmit,
  isPending,
  theme,
}: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        className={`flex-grow p-3 border rounded-xl shadow focus:outline-none transition
          ${theme === 'dark'
            ? 'bg-gray-900 text-blue-100 border-gray-700 focus:ring-blue-800'
            : 'bg-white text-gray-900 border-gray-300 focus:ring-blue-400'}`}
        disabled={isPending}
        placeholder="Type your message..."
        autoFocus
      />
      <button
        type="submit"
        disabled={isPending || input.trim() === ''}
        className={`px-5 py-3 rounded-xl shadow font-semibold transition
          ${theme === 'dark'
            ? 'bg-blue-800 text-white hover:bg-blue-900'
            : 'bg-blue-600 text-white hover:bg-blue-700'}`}
      >
        {isPending ? "Sending..." : "Send"}
      </button>
    </form>
  );
}