import { sequelize } from '../../db/connectionDB.mjs';
import { AzureOpenAI } from 'openai';

const client = new AzureOpenAI({
  azure_endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_KEY,
  apiVersion: "2024-02-01"
});

class QuoteSearchService {
    /**
     * Search within a specific file's content
     * @param {string} query - User question
     * @param {string} conversationId - ID of the file to search within
     * @returns {Promise<Array>} Enhanced results
     */
    static async searchInFile(query, conversationId) {
      if (!query || typeof query !== 'string') {
        throw new Error('Query must be a non-empty string.');
      }
  
      const fileContent = await sequelize.query(
        `
        SELECT "originalText", "cleanedText" 
        FROM "Quotes"
        WHERE "conversationId" = :conversationId
        ORDER BY "position" ASC
        `,
        {
          replacements: { conversationId },
          type: sequelize.QueryTypes.SELECT
        }
      );
  
      if (fileContent.length === 0) {
        throw new Error('File not found or empty');
      }
  
      const fullText = fileContent.map(c => c.cleanedText || c.originalText).join('\n\n');
      return this.analyzeWithAI(query, fullText, conversationId);
    }
  
    /**
     * Uses AI to find relevant information in document context
     * @param {string} query - User question
     * @param {string} fullText - Full text of the document
     * @param {string} conversationId - ID of the file being analyzed
     * @returns {Promise<Object>} Analysis results
     */
    static async analyzeWithAI(query, fullText, conversationId) {
      try {
        const response = await client.chat.completions.create({
          model: process.env.AZURE_OPENAI_MODEL,
          messages: [
            {
              role: "system",
              content: `Analyze this document and answer the question. 
              Return JSON with: {
                "answer": "direct answer to question",
                "relevantSections": [{
                  "text": "excerpt",
                  "page": number,
                  "relevanceScore": 0-1
                }]
              }`
            },
            {
              role: "user",
              content: `Document:\n${fullText}\n\nQuestion: ${query}`
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.3
        });
  
        const analysis = JSON.parse(response.choices[0].message.content);
        
        return {
          conversationId,
          answer: analysis.answer,
          relevantSections: analysis.relevantSections || [],
          fullAnalysis: analysis
        };
  
      } catch (error) {
        console.error('AI analysis failed:', error);
        return {
          conversationId,
          answer: "I couldn't analyze this document. Please try again.",
          relevantSections: []
        };
      }
    }
  }

export default QuoteSearchService;