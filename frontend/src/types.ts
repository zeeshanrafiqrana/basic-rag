export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  documents?: Document[];
  timestamp: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}