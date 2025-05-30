import React, { useState, useRef, DragEvent } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useTheme } from '../context/ThemeContext';
import { Document } from '../types';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [attachedDocuments, setAttachedDocuments] = useState<Document[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useChat();
  const { isDarkMode } = useTheme();

  const handleSendMessage = () => {
    if (message.trim() || attachedDocuments.length > 0) {
      sendMessage(message, attachedDocuments);
      setMessage('');
      setAttachedDocuments([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const newDocuments: Document[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newDocuments.push({
        id: `doc-${Date.now()}-${i}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      });
    }

    setAttachedDocuments([...attachedDocuments, ...newDocuments]);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFileChange(files);
  };

  const removeDocument = (docId: string) => {
    setAttachedDocuments(attachedDocuments.filter(doc => doc.id !== docId));
  };

  return (
    <div className={`p-4 border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      {attachedDocuments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachedDocuments.map(doc => (
            <div 
              key={doc.id} 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <span className="truncate max-w-[150px]">{doc.name}</span>
              <button 
                onClick={() => removeDocument(doc.id)}
                className="p-0.5 rounded-full hover:bg-gray-600 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div 
        className={`flex items-end gap-2 rounded-lg border p-2 ${
          isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        } ${isDragging ? 'border-indigo-500 ring-2 ring-indigo-500/20' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <button 
          onClick={() => fileInputRef.current?.click()}
          className={`p-2 rounded-md ${
            isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-100'
          } transition-colors`}
        >
          <Paperclip size={20} />
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            multiple
            onChange={(e) => handleFileChange(e.target.files)}
          />
        </button>
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isDragging ? 'Drop files here...' : 'Type a message...'}
          className={`flex-1 resize-none max-h-32 outline-none py-2 px-3 ${
            isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-800 placeholder-gray-500'
          }`}
          rows={1}
        />
        
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() && attachedDocuments.length === 0}
          className={`p-2 rounded-md ${
            !message.trim() && attachedDocuments.length === 0
              ? isDarkMode ? 'text-gray-500 bg-gray-700' : 'text-gray-400 bg-gray-100'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          } transition-colors`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;