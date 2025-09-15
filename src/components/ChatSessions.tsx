import React from "react";
import type { ChatSession } from "../types";

interface Props {
  chatSessions: ChatSession[];
  selectSession: (id: string) => void;
  handleLogout: () => void;
  onNewChat: () => void;
  sessionsLoading: boolean;
  currentSessionId: string;
  theme: 'light' | 'dark';
}

export default function ChatSessions({
  chatSessions,
  selectSession,
  onNewChat,
  sessionsLoading,
  currentSessionId,
  theme,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {sessionsLoading ? (
          <div className={`p-4 text-center ${theme === 'dark' ? 'text-blue-200' : 'text-gray-400'}`}>Loading...</div>
        ) : chatSessions.length === 0 ? (
          <div className={`p-4 text-center ${theme === 'dark' ? 'text-blue-200' : 'text-gray-400'}`}>No chats yet.</div>
        ) : (
          chatSessions.map(session => (
            <button
              key={session.id}
              onClick={() => selectSession(session.id)}
              className={`w-full text-left px-4 py-3 border-b flex flex-col gap-1 transition
                ${session.id === currentSessionId
                  ? theme === 'dark'
                    ? "bg-blue-900 border-blue-700"
                    : "bg-blue-50 border-blue-600"
                  : theme === 'dark'
                    ? "hover:bg-gray-700 border-transparent"
                    : "hover:bg-blue-100 border-transparent"}`}
            >
              <span className={`font-medium ${session.id === currentSessionId ? (theme === 'dark' ? "text-blue-200" : "text-blue-700") : (theme === 'dark' ? "text-blue-100" : "text-gray-700")}`}>
                {session.title}
              </span>
              <span className={`text-xs truncate ${theme === 'dark' ? "text-blue-300" : "text-gray-400"}`}>{session.lastMessage}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}