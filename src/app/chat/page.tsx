"use client"

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
      messagesQuery.refetch();
      setInput('');
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      alert('Failed to get a response from the AI. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || sendMessageMutation.isPending) return;

    // Map messages to the expected history format
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
  if (status === "loading") return <div>Loading...</div>;
  if (!session)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="mb-4">You must be signed in to use the chat.</p>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Sign in
        </button>
      </div>
    );

  console.log('chat session', chatSessions);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <ChatSessions
        chatSessions={chatSessions}
        selectSession={selectSession}
        handleLogout={handleLogout}
        onNewChat={handleNewChat}
        sessionsLoading={chatSessionsQuery.isLoading}
        currentSessionId={currentSessionId}
      />
      <div className="flex-grow flex flex-col p-4 md:p-8">
        <ChatWindow
          messages={messages}
          loading={messagesQuery.isLoading || sendMessageMutation.isPending}
        />
        <ChatInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isPending={sendMessageMutation.isPending}
        />
      </div>
    </div>
  );
}