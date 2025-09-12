import type { ChatSession } from '../types';

interface Props {
  chatSessions: ChatSession[];
  selectSession: (id: string) => void;
  handleLogout: () => void;
}

export default function ChatSessions({ chatSessions, selectSession, handleLogout }: Props) {
  return (
    <div className="w-full md:w-1/4 lg:w-1/5 bg-white shadow-lg p-4 flex flex-col border-r border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Chat Sessions</h2>
        <button className="text-blue-600 hover:text-blue-800 transition duration-300" title="New session">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
      <ul className="space-y-2 flex-grow overflow-y-auto">
        {chatSessions.map(session => (
          <li key={session.id}>
            <button
              onClick={() => selectSession(session.id)}
              className={`w-full text-left p-3 rounded-lg transition duration-300
                ${session.active ? 'bg-blue-50 border-l-4 border-blue-600' : 'bg-gray-50 hover:bg-gray-100 border-l-4 border-transparent'}`}
            >
              <h3 className="text-sm font-semibold text-gray-800 truncate">{session.title}</h3>
              <p className="text-xs text-gray-500 truncate mt-1">{session.lastMessage}</p>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 border-t pt-4">
        <button
          onClick={handleLogout}
          className="w-full text-center py-2 px-4 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-300"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
