import React from "react";
import type { ChatSession } from "../types";

interface Props {
  chatSessions: ChatSession[];
  selectSession: (id: string) => void;
  handleLogout: () => void;
  onNewChat: () => void;
  sessionsLoading: boolean;
  currentSessionId: string;
}

export default function ChatSessions({
  chatSessions,
  selectSession,
  onNewChat,
  sessionsLoading,
  currentSessionId,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white/90">
        <span className="font-semibold text-blue-700 text-lg">Chats</span>
        <button
          onClick={onNewChat}
          className="px-3 py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
        >
          + New
        </button>
      </div>
      <div className="flex-1 overflow-y-auto bg-white/80">
        {sessionsLoading ? (
          <div className="p-4 text-gray-400 text-center">Loading...</div>
        ) : chatSessions.length === 0 ? (
          <div className="p-4 text-gray-400 text-center">No chats yet.</div>
        ) : (
          chatSessions.map(session => (
            <button
              key={session.id}
              onClick={() => selectSession(session.id)}
              className={`w-full text-left px-4 py-3 border-b flex flex-col gap-1 transition
                ${session.id === currentSessionId
                  ? "bg-blue-50 border-blue-600"
                  : "hover:bg-blue-100 border-transparent"}`}
            >
              <span className={`font-medium ${session.id === currentSessionId ? "text-blue-700" : "text-gray-700"}`}>
                {session.title}
              </span>
              <span className="text-xs text-gray-400 truncate">{session.lastMessage}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}