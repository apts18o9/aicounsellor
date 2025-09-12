export interface ChatSession{
    id: string,
    title: string,
    lastMessage: string,
    active: boolean
}

export interface Message{
    id: number,
    text: string,
    sender: 'user' | 'ai',
    timestamp: string
}