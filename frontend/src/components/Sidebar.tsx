import React, { useState } from 'react';
import { PlusCircle, Search, MessageSquare, Settings, Moon, Sun } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar: React.FC = () => {
  const { conversations, activeConversationId, startNewConversation, setActiveConversation } = useChat();
  
  const { isDarkMode, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`w-64 flex-shrink-0 h-full flex flex-col border-r ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
      } transition-colors duration-200 ease-in-out`}>
      <div className="p-4">
        <button
          onClick={startNewConversation}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle size={18} />
          <span>New Chat</span>
        </button>
      </div>

      <div className="px-4 py-2">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'
          }`}>
          <Search size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-transparent outline-none ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
              }`}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setActiveConversation(conversation.id)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${activeConversationId === conversation.id
                  ? isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'
                  : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
            >
              <MessageSquare size={16} className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} />
              <div className="flex-1 truncate">
                <p className="text-sm font-medium truncate">{conversation.title}</p>
                <p className="text-xs truncate opacity-70">
                  {conversation.messages.length > 0
                    ? conversation.messages[conversation.messages.length - 1].content.substring(0, 30) + '...'
                    : 'No messages yet'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className={`px-4 py-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>No conversations found</p>
          </div>
        )}
      </div>

      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <button className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            } transition-colors`}>
            <Settings size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
          </button>

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              } transition-colors`}
          >
            {isDarkMode ? (
              <Sun size={20} className="text-gray-300" />
            ) : (
              <Moon size={20} className="text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;