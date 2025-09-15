import React from "react";

export type ChatInputProps = {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<Element>) => void;
  isPending: boolean;
};

export default function ChatInput({
  input,
  setInput,
  handleSubmit,
  isPending,
}: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        className="flex-grow p-3 border rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        disabled={isPending}
        placeholder="Type your message..."
        autoFocus
      />
      <button
        type="submit"
        disabled={isPending || input.trim() === ''}
        className="px-5 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition font-semibold"
      >
        Send
      </button>
    </form>
  );
}