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
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        disabled={isPending}
        className="flex-grow p-2 border rounded"
        placeholder="Type your message..."
      />
      <button type="submit" disabled={isPending} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
        {isPending ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}