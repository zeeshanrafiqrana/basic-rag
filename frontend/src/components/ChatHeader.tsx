import React from 'react';
import { MoreHorizontal, Share2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ChatHeaderProps {
  title: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`py-3 px-4 border-b flex items-center justify-between ${
      isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'
    }`}>
      <h2 className="font-medium truncate">{title}</h2>
      <div className="flex items-center gap-2">
        <button className={`p-2 rounded-full ${
          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
        } transition-colors`}>
          <Share2 size={18} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
        </button>
        <button className={`p-2 rounded-full ${
          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
        } transition-colors`}>
          <MoreHorizontal size={18} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;