import { Conversation } from './types';

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Document Analysis Help',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Can you analyze this document for me and summarize the key points?',
        timestamp: '2023-04-12T14:22:00Z'
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: `I'd be happy to analyze your document and provide a summary of the key points. Could you please upload the document you'd like me to review?`,
        timestamp: '2023-04-12T14:22:05Z'
      },
      {
        id: 'msg-3',
        role: 'user',
        content: 'Here is the quarterly report.',
        documents: [
          {
            id: 'doc-1',
            name: 'Q1_Report_2023.pdf',
            type: 'application/pdf',
            size: 1250000,
            url: '#'
          }
        ],
        timestamp: '2023-04-12T14:23:30Z'
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: `Thank you for sharing the Q1 2023 report. Here's a summary of the key points:

1. Revenue increased by 15% compared to Q1 2022
2. New customer acquisition is up by 22%
3. The European market showed the strongest growth at 28%
4. R&D expenses increased by 10% due to the new product line development
5. The board has approved a new sustainability initiative starting in Q2

Would you like me to elaborate on any specific section of the report?`,
        timestamp: '2023-04-12T14:24:00Z'
      }
    ],
    createdAt: '2023-04-12T14:22:00Z'
  },
  {
    id: 'conv-2',
    title: 'Data Visualization Project',
    messages: [
      {
        id: 'msg-5',
        role: 'user',
        content: 'I need help creating visualizations for my data science project',
        timestamp: '2023-04-10T09:15:00Z'
      },
      {
        id: 'msg-6',
        role: 'assistant',
        content: `I'd be happy to help with your data visualization project. What kind of data are you working with, and what types of visualizations are you looking to create?`,
        timestamp: '2023-04-10T09:15:10Z'
      },
      {
        id: 'msg-7',
        role: 'user',
        content: 'I have customer demographic data and purchase history. I want to see if there are any patterns in purchasing behavior based on age, location, and income level.',
        timestamp: '2023-04-10T09:16:30Z'
      },
      {
        id: 'msg-8',
        role: 'assistant',
        content: `For analyzing purchasing patterns based on demographics, I recommend these visualization approaches:

1. **Scatter plots** to show relationships between income and purchase amounts
2. **Heat maps** to visualize purchase frequency across different age groups and product categories
3. **Choropleth maps** to display regional purchasing patterns
4. **Bar charts** comparing average purchase values across different demographic segments
5. **Correlation matrices** to identify which demographic factors most strongly correlate with purchasing behavior

Would you like me to suggest specific tools or libraries for creating these visualizations?`,
        timestamp: '2023-04-10T09:17:45Z'
      }
    ],
    createdAt: '2023-04-10T09:15:00Z'
  },
  {
    id: 'conv-3',
    title: 'Meeting Notes',
    messages: [
      {
        id: 'msg-9',
        role: 'user',
        content: 'Can you help me organize my meeting notes from today?',
        timestamp: '2023-04-11T16:30:00Z'
      },
      {
        id: 'msg-10',
        role: 'assistant',
        content: `I'd be happy to help you organize your meeting notes. Could you share the notes with me, or would you like some suggestions on how to structure them?`,
        timestamp: '2023-04-11T16:30:15Z'
      }
    ],
    createdAt: '2023-04-11T16:30:00Z'
  }
];