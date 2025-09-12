'use client'
import { useState } from 'react';
import ChatSessions from '@/components/ChatSessions';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import type { ChatSession, Message } from '@/types';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();
  
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    { id: '1', title: 'My first career path', lastMessage: 'Great, thanks for your help!', active: true },
    { id: '2', title: 'Resume review session', lastMessage: 'I will send you my new resume.', active: false },
    { id: '3', title: 'Interview prep questions', lastMessage: 'Sounds good!', active: false },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('1');

  const [mockMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I help you with your career goals today?", sender: 'ai', timestamp: '10:00 AM' },
    { id: 2, text: "I'm looking for advice on transitioning from marketing to data science.", sender: 'user', timestamp: '10:02 AM' },
    { id: 3, text: "That's a great goal! To start, let's talk about the key skills needed for data science...", sender: 'ai', timestamp: '10:03 AM' },
    { id: 4, text: "What kind of projects should I work on to build a portfolio?", sender: 'user', timestamp: '10:05 AM' },
  ]);

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

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <ChatSessions chatSessions={chatSessions} selectSession={selectSession} handleLogout={handleLogout} />
      <div className="flex-grow flex flex-col p-4 md:p-8">
        <ChatWindow messages={mockMessages} />
        <ChatInput />
      </div>
    </div>
  );
}
