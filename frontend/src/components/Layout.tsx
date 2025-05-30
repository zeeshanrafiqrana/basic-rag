import React from 'react';
import Sidebar from './Sidebar';
import ChatContainer from './ChatContainer';
import { useTheme } from '../context/ThemeContext';

const Layout: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`h-screen flex overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <Sidebar />
      <ChatContainer />
    </div>
  );
};

export default Layout;