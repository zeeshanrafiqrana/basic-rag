import { sequelize } from '../../db/connectionDB.mjs';
import Conversation from '../../models/conversationModel.mjs';
import { AzureOpenAI } from 'openai';

const client = new AzureOpenAI({
    azure_endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    apiKey: process.env.AZURE_OPENAI_KEY,
    apiVersion: "2024-02-01"
});

class QuoteSearchService {
    /**
     * Searches for a query in the document content associated with a conversation
     * @param {string} query - The user's question to search in the document
     * @param {string} conversationId - The ID of the conversation to search in
     * @returns {Promise<Object>} - The analysis result containing answer and relevant sections
     * @throws {Error} - If the query is invalid or if there are issues with the conversation
     */
    static async searchInFile(query, conversationId) {
        if (!query || typeof query !== 'string') {
            throw new Error('Query must be a non-empty string.');
        }

        let conversation;
        try {
            conversation = await Conversation.findByPk(conversationId);
            if (!conversation) {
                conversation = await Conversation.create({
                    id: conversationId,
                    title: `Document Analysis - ${new Date().toLocaleDateString()}`
                });
            }
        } catch (error) {
            return error
        }

        try {
            const fileContent = await sequelize.query(
                `SELECT "originalText", "cleanedText" 
             FROM "Quote"
             WHERE "conversationId" = :conversationId
             ORDER BY "position" ASC`,
                {
                    replacements: { conversationId },
                    type: sequelize.QueryTypes.SELECT
                }
            );

            if (fileContent.length === 0) {
                throw new Error('No document content found');
            }

            const fullText = fileContent.map(c => c.cleanedText || c.originalText).join('\n\n');
            const results = await this.analyzeWithAI(query, fullText, conversation.messages);

            await this.updateConversationHistory(conversation, query, results.answer);

            return results;
        } catch (error) {
            await this.updateConversationHistory(
                conversation,
                query,
                `Error processing your request: ${error.message}`
            );
            throw error;
        }
    }
    /**
     * Analyzes the document content using AI to find relevant sections and answers
     * @param {string} query - The user's question
     * @param {string} fullText - The full text of the document
     * @param {Array} messageHistory - Previous messages in the conversation
     * @returns {Promise<Object>} - Analysis result containing answer and relevant sections
     */
    static async analyzeWithAI(query, fullText, messageHistory = []) {
        try {
            const messages = [
                {
                    role: "system",
                    content: `You are a helpful assistant that returns JSON formatted responses. 
              Analyze this document and answer the question in JSON format with these fields: {
                "answer": "direct answer to question",
                "relevantSections": [{
                  "text": "excerpt",
                  "relevanceScore": 0-1
                }]
              }`
                },
                ...messageHistory.map(msg => ({
                    role: msg.role || 'user',
                    content: msg.content
                })),
                {
                    role: "user",
                    content: `Document content:\n${fullText}\n\nQuestion: ${query}\n\nPlease respond in JSON format.`
                }
            ];

            const response = await client.chat.completions.create({
                model: process.env.AZURE_OPENAI_MODEL,
                messages,
                response_format: { type: "json_object" },
                temperature: 0.3
            });

            const analysis = JSON.parse(response.choices[0].message.content);

            return {
                answer: analysis.answer || "No answer found",
                relevantSections: analysis.relevantSections || []
            };

        } catch (error) {
            return {
                answer: "I couldn't analyze this document. Please try again.",
                relevantSections: []
            };
        }
    }
    /**
     * Updates the conversation history with the user's query and AI's answer
     * @param {Object} conversation - The conversation object to update
     * @param {string} query - The user's question
     * @param {string} answer - The AI's response
     */
    static async updateConversationHistory(conversation, query, answer) {
        conversation.messages = [
            ...conversation.messages,
            { role: 'user', content: query, timestamp: new Date() },
            { role: 'assistant', content: answer, timestamp: new Date() }
        ];
        await conversation.save();
    }
}

export default QuoteSearchService;