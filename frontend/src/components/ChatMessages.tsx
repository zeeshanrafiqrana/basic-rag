import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useChat } from '../context/ChatContext';
import { Message } from '../types';
import DocumentPreview from './DocumentPreview';
import LoadingIndicator from './LoadingIndicator';

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const { isDarkMode } = useTheme();
  const { isProcessing } = useChat();

  if (messages.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Start a conversation by sending a message.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
        >
          <div
            className={`max-w-[80%] md:max-w-[70%] rounded-lg px-4 py-3 ${
              message.role === 'user'
                ? isDarkMode 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-indigo-500 text-white'
                : isDarkMode 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-white text-gray-800 border border-gray-200'
            }`}
          >
            {message.content}
            
            {message.documents && message.documents.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.documents.map((doc, idx) => (
                  <DocumentPreview key={idx} document={doc} />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      
      {isProcessing && (
        <div className="flex justify-start animate-fadeIn">
          <div className={`rounded-lg px-4 py-3 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
          }`}>
            <LoadingIndicator />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages