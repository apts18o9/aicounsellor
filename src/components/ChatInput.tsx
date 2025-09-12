export default function ChatInput() {
  return (
    <div className="mt-6 flex items-center bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <textarea
        rows={1}
        className="flex-grow resize-none overflow-hidden rounded-md border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Message Oration AI..."
      />
      <button
        className="ml-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
        title="Send message"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </button>
    </div>
  );
}
