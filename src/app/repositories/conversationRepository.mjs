import Conversation from '../../models/conversationModel.mjs';

class ConversationRepository {
    /**
     * Creates a new conversation with an optional title
     * @param {string} [title] - Title of the conversation
     * @returns {Promise<Object>} - Created conversation record
     */
    static async createConversation(title = 'New Conversation') {
        return await Conversation.create({ title });
    }
    /**
     * Retrieves all conversations from the database
     * @returns {Promise<Array>} - List of all conversation records
     */
    static async getAllConversations() {
        return await Conversation.findAll({
            order: [['updatedAt', 'DESC']],
        });
    }
}

export default ConversationRepository;
