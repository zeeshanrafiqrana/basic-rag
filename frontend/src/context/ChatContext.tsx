/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Conversation, Message, Document } from '../types';
import axios from 'axios';

interface ChatContextType {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | null;
  startNewConversation: () => void;
  setActiveConversation: (id: string) => void;
  sendMessage: (content: string, documents?: Document[]) => void;
  isProcessing: boolean;
}

const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;
const API_URL = import.meta.env.VITE_API_URL;

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);


  const activeConversation =
    conversations.find((conv) => conv.id === activeConversationId) || null;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${API_URL}/conversations`, {
          headers: {
            Authorization: `Bearer ${SECRET_TOKEN}`,
          },
        });

        const all = res.data.conversations;
        setConversations(all);

        const savedId = localStorage.getItem('activeConversationId');
        if (savedId && all.some((c: Conversation) => c.id === savedId)) {
          setActiveConversationId(savedId);
        } else if (all.length > 0) {
          setActiveConversationId(all[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
      }
    };

    fetchConversations();
  }, []);


  const startNewConversation = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/conversations`,
        {},
        {
          headers: {
            Authorization: `Bearer ${SECRET_TOKEN}`,
          },
        }
      );

      const { conversationId, title } = res.data;

      const newConv: Conversation = {
        id: conversationId,
        title,
        messages: [],
        createdAt: new Date().toISOString(),
      };

      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(conversationId);
      localStorage.setItem('activeConversationId', conversationId);
    } catch (err) {
      console.error('Failed to create new conversation:', err);
    }
  };

  const setActiveConversation = (id: string) => {
    setActiveConversationId(id);
    localStorage.setItem('activeConversationId', id);
  };

  const sendMessage = async (content: string, documents: Document[] = []) => {
    if (!activeConversationId) return;
  
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
      documents,
      timestamp: new Date().toISOString(),
    };
  
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversationId) {
          const shouldUpdateTitle = conv.messages.length === 0 && content.trim() !== '';
          const newTitle =
            shouldUpdateTitle && content.length > 0
              ? content.length > 30
                ? content.substring(0, 30) + '...'
                : content
              : conv.title;
  
          return {
            ...conv,
            title: newTitle,
            messages: [...conv.messages, userMessage],
          };
        }
        return conv;
      })
    );
  
    try {
      setIsProcessing(true);
  
      if (documents.length > 0) {
        const uploadUrl = `${API_URL}/upload/${activeConversationId}`;
        const formData = new FormData();
  
        const blobs = await Promise.all(
          documents.map((doc) =>
            fetch(doc.url)
              .then((res) => res.blob())
              .then((blob) => ({
                blob,
                name: doc.name,
                type: doc.type,
              }))
          )
        );
  
        blobs.forEach(({ blob, name, type }) => {
          formData.append('documents', new File([blob], name, { type }));
        });
  
        await axios.post(uploadUrl, formData, {
          headers: {
            Authorization: `Bearer ${SECRET_TOKEN}`,
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Wait only if documents were uploaded
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
  
      const trySendQuery = async (query: string, retries = 2): Promise<string> => {
        try {
          const res = await axios.post(
            `${API_URL}/search/${activeConversationId}`,
            { query },
            {
              headers: {
                Authorization: `Bearer ${SECRET_TOKEN}`,
              },
            }
          );
          return res.data.answer || generateAIResponse(query);
        } catch (error: unknown) {
          if (axios.isAxiosError(error) && error.response?.status === 404 && retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            return trySendQuery(query, retries - 1);
          }
          console.error('Failed search request:', error);
          throw error;
        }
      };
  
      if (content.trim().length > 0) {
        const aiContent = await trySendQuery(content);
  
        const aiMessage: Message = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: aiContent,
          timestamp: new Date().toISOString(),
        };
  
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === activeConversationId
              ? { ...conv, messages: [...conv.messages, aiMessage] }
              : conv
          )
        );
      }
    } catch (err) {
      console.error('Error sending message or processing API calls:', err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  
  
  const generateAIResponse = (userInput: string): string => {
    if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
      return 'Hello! How can I assist you today?';
    } else if (userInput.toLowerCase().includes('help')) {
      return "I'm here to help. What do you need assistance with?";
    } else if (
      userInput.toLowerCase().includes('document') ||
      userInput.toLowerCase().includes('file')
    ) {
      return "I've received your document. What would you like me to do with it?";
    } else if (userInput.length < 10) {
      return 'Could you provide more details so I can better assist you?';
    } else {
      return "Thank you for your message. I'm processing your request and will assist you accordingly. Is there anything specific you'd like to know about this topic?";
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        activeConversation,
        startNewConversation,
        setActiveConversation,
        sendMessage,
        isProcessing,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
