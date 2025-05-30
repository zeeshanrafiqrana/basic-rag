import React from 'react';
import { FileText, Image, FileIcon, DownloadCloud } from 'lucide-react';
import { Document } from '../types';
import { useTheme } from '../context/ThemeContext';

interface DocumentPreviewProps {
  document: Document;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document }) => {
  const { isDarkMode } = useTheme();
  
  const getDocumentIcon = () => {
    if (document.type.startsWith('image/')) {
      return <Image size={20} />;
    } else if (document.type.includes('pdf')) {
      return <FileText size={20} />;
    } else {
      return <FileIcon size={20} />;
    }
  };
  
  return (
    <div className={`flex items-center gap-3 p-2 rounded-md ${
      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
    }`}>
      <div className={`p-2 rounded-md ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
        {getDocumentIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {document.name}
        </p>
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {(document.size / 1024).toFixed(1)} KB
        </p>
      </div>
      
      <a 
        href={document.url} 
        download={document.name}
        className={`p-1.5 rounded-md ${
          isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
        } transition-colors`}
      >
        <DownloadCloud size={18} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
      </a>
    </div>
  );
};

export default DocumentPreview;