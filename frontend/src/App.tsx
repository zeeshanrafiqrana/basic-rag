import React from 'react';
import Layout from './components/Layout';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <Layout />
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;