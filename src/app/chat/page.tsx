"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import ChatSessions from '@/components/ChatSessions';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import { useSession, signOut } from 'next-auth/react';
import type { ChatSession, Message } from '@/types';

export default function ChatPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [input, setInput] = useState('');

  // Use authenticated user's id and email
  const userId = session?.user?.id ?? '';
  const userEmail = session?.user?.email ?? '';

  // Fetch chat sessions
  const chatSessionsQuery = trpc.chat.getChatSessions.useQuery(
    { userId },
    { enabled: !!userId }
  );

  // Fetch messages for the active session
  const messagesQuery = trpc.chat.getMessagesBySessionId.useQuery(
    { sessionId: currentSessionId },
    { enabled: !!currentSessionId }
  );

  // Mutation to create a new session
  const createSessionMutation = trpc.chat.createChatSession.useMutation({
    onSuccess: (newSession) => {
      setCurrentSessionId(newSession.id);
      chatSessionsQuery.refetch();
    },
  });

  const handleNewChat = () => {
    createSessionMutation.mutate({ userId, title: "New Chat", userEmail });
  };

  const selectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  // Mutation to send a message
  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      setInput('');
      messagesQuery.refetch();
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      alert('Failed to get a response from the AI. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || sendMessageMutation.isPending) return;

    const history = (messagesQuery.data || []).map(msg => ({
      role: msg.sender === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.text }],
    }));

    sendMessageMutation.mutate({
      message: input,
      sessionId: currentSessionId,
      history,
    });
  };

  const updateTitleMutation = trpc.chat.updateChatSessionTitle.useMutation({
    onSuccess: () => {
      chatSessionsQuery.refetch();
    },
  });

  const handleTitleUpdate = (newTitle: string) => {
    if (currentSessionId && newTitle.trim()) {
      updateTitleMutation.mutate({ sessionId: currentSessionId, title: newTitle });
    }
  };

  // Map backend sessions to frontend ChatSession type
  const chatSessions: ChatSession[] = (chatSessionsQuery.data || []).map(session => ({
    id: session.id,
    title: session.title,
    lastMessage: session.lastMessage ?? '',
    active: session.id === currentSessionId,
  }));

  // Map backend messages to frontend Message type
  const messages: Message[] = (messagesQuery.data || []).map(msg => ({
    id: Number(msg.id),
    text: msg.text,
    sender: msg.sender.toLowerCase() === 'user' ? 'user' : 'ai',
    timestamp: msg.timestamp,
  }));

  // Show loading or sign-in UI
  if (status === "loading") return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
  if (!session)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <p className="mb-4 text-lg text-gray-700">You must be signed in to use the chat.</p>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Sign in
        </button>
      </div>
    );

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white/80 border-r border-gray-200 shadow-lg z-10">
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <span className="font-semibold text-blue-700 text-lg">Chats</span>
          <button
            onClick={handleNewChat}
            className="px-3 py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          >
            + New
          </button>
        </div>
        <ChatSessions
          chatSessions={chatSessions}
          selectSession={selectSession}
          handleLogout={handleLogout}
          onNewChat={handleNewChat}
          sessionsLoading={chatSessionsQuery.isLoading}
          currentSessionId={currentSessionId}
        />
      </aside>

      {/* Main Chat Area */}
      <main className="flex flex-col flex-1 h-full relative">
        {/* Chat header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b px-8 py-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-blue-700">
              Hello, {userEmail}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Chat window */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <ChatWindow
            messages={messages}
            loading={messagesQuery.isLoading || sendMessageMutation.isPending}
            sessionId={currentSessionId}
            sessionTitle={chatSessions.find(s => s.id === currentSessionId)?.title ?? ""}
            onTitleUpdate={handleTitleUpdate}
          />
        </div>

        {/* Chat input */}
        {currentSessionId && (
          <div className="sticky bottom-0 z-10 bg-white/90 backdrop-blur px-8 py-4 border-t shadow-lg">
            <ChatInput
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isPending={sendMessageMutation.isPending}
            />
          </div>
        )}
      </main>
    </div>
  );
}