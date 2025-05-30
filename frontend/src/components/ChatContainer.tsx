import React, { useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useChat } from '../context/ChatContext';
import { useTheme } from '../context/ThemeContext';

const ChatContainer: React.FC = () => {
  const { activeConversation } = useChat();
  const { isDarkMode } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {activeConversation ? (
        <>
          <ChatHeader title={activeConversation.title} />
          <div className="flex-1 overflow-y-auto px-4 py-2">
            <ChatMessages messages={activeConversation.messages} />
            <div ref={messagesEndRef} />
          </div>
          <ChatInput />
        </>
      ) : (
        <div className={`flex-1 flex flex-col items-center justify-center ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <div className="text-center max-w-md p-6">
            <h3 className="text-2xl font-semibold mb-2">AI Assistant</h3>
            <p className="mb-6">
              Start a new conversation or select an existing one from the sidebar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;