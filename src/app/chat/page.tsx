'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import ChatSessions from '@/components/ChatSessions';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import type { ChatSession } from '@/types';
import { z } from 'zod';
import type { Message } from '@/types';

// Define the schema for a single chat message
const chatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.array(z.object({
    text: z.string(),
  })),
});

// Infer the TypeScript type from the schema
type ChatMessage = z.infer<typeof chatMessageSchema>;


const mapChatMessagesToMessages = (chatMessages: ChatMessage[]): Message[] =>
  chatMessages.map((msg, idx) => ({
    id: idx,
    text: msg.parts.map(part => part.text).join(' '),
    sender: msg.role === 'user' ? 'user' : 'ai',
    timestamp: new Date().toLocaleTimeString(),
  }));

export default function ChatPage() {
  const router = useRouter();

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    { id: '1', title: 'My first career path', lastMessage: 'Great, thanks for your help!', active: true },
    { id: '2', title: 'Resume review session', lastMessage: 'I will send you my new resume.', active: false },
    { id: '3', title: 'Interview prep questions', lastMessage: 'Sounds good!', active: false },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('1');

  // State to hold the conversation messages dynamically
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  // tRPC mutation hook for sending messages
  const chatMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (aiResponse) => {
      // Cast role to "user" | "model" if you trust the backend
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...aiResponse,
          role: aiResponse.role === "user" ? "user" : "model"
        } as ChatMessage
      ]);
      setInput('');
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      alert('Failed to get a response from the AI. Please try again.');
    },
  });

  const selectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setChatSessions(chatSessions.map(session => ({
      ...session,
      active: session.id === sessionId
    })));
  };

  const handleLogout = () => {
    router.push('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || chatMutation.isPending) return;
    // Build the new history including the user's message
    const newMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    const history = [...messages, newMessage];
    chatMutation.mutate({ message: input, history });
    setMessages(history); // Optimistically update local state
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <ChatSessions chatSessions={chatSessions} selectSession={selectSession} handleLogout={handleLogout} />
      <div className="flex-grow flex flex-col p-4 md:p-8">
        <ChatWindow messages={mapChatMessagesToMessages(messages)} />
        <ChatInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={chatMutation.isPending}
        />
      </div>
    </div>
  );
}