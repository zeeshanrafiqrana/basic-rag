import React from 'react';
import { useTheme } from '../context/ThemeContext';

const LoadingIndicator: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="flex items-center gap-1">
      <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'} animate-typing-dots`}></div>
      <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'} animate-typing-dots [animation-delay:0.2s]`}></div>
      <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'} animate-typing-dots [animation-delay:0.4s]`}></div>
    </div>
  );
};

export default LoadingIndicator;