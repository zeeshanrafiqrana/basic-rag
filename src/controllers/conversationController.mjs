import ConversationRepository from '../app/repositories/conversationRepository.mjs';
import { API_STATUS_CODES, RESPONSE_MESSAGES } from '../constant/apiStatus.mjs';

class ConversationController {
  /**
   * Handles the creation of a new conversation
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async createConversation(req, res) {
    try {
      const { title } = req.body;
      const conversation = await ConversationRepository.createConversation(title);

      return res.status(API_STATUS_CODES.SUCCESS).json({
        statusCode: API_STATUS_CODES.SUCCESS,
        message: RESPONSE_MESSAGES.DATA_ADDED,
        conversationId: conversation.id,
        title: conversation.title
      });
    } catch (error) {
      console.error('Create Conversation Error:', error.message);
      return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        statusCode: API_STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: RESPONSE_MESSAGES.SERVER_ERROR,
        error: error.message
      });
    }
  }
    /**
     * Handles the retrieval of all conversations
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async getAllConversations(req, res) {
        try {
          const conversations = await ConversationRepository.getAllConversations();
          return res.status(API_STATUS_CODES.SUCCESS).json({
            statusCode: API_STATUS_CODES.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            conversations
          });
        } catch (error) {
          console.error('Fetch Conversations Error:', error.message);
          return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: API_STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: RESPONSE_MESSAGES.SERVER_ERROR,
            error: error.message
          });
        }
      }
}

export default ConversationController;
