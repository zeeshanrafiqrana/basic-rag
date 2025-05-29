import QuoteSearchService from '../app/service/quoteSearchService.mjs';
import { API_STATUS_CODES, RESPONSE_MESSAGES } from '../constant/apiStatus.mjs'; 

class SearchController {
  /**
   * Handles the search query for a specific file in a conversation.
   * @param {Object} req - The request object containing the query and conversationId.
   * @param {Object} res - The response object to send the results.
   * @returns {Promise<Object>} - The response with the search results or an error message.
   */
  static async askAboutFile(req, res) {
    try {
      const { query } = req.body;
      const { conversationId } = req.params;

      if (!query?.trim()) {
        return res.status(API_STATUS_CODES.ERROR_CODE).json({
          statusCode: API_STATUS_CODES.ERROR_CODE,
          message: RESPONSE_MESSAGES.MISSING_PARAMETERS,
        });
      }

      try {
        const results = await QuoteSearchService.searchInFile(query, conversationId);

        return res.status(API_STATUS_CODES.SUCCESS).json({
          statusCode: API_STATUS_CODES.SUCCESS,
          message: RESPONSE_MESSAGES.SUCCESS,
          query,
          conversationId,
          answer: results.answer,
          relevantSections: results.relevantSections,
        });

      } catch (error) {
        if (error.message.includes('No document content found')) {
          return res.status(API_STATUS_CODES.NOT_FOUND).json({
            statusCode: API_STATUS_CODES.NOT_FOUND,
            message: RESPONSE_MESSAGES.NOT_FOUND,
            conversationId,
          });
        }

        throw error;
      }

    } catch (error) {
      return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        statusCode: API_STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: RESPONSE_MESSAGES.SERVER_ERROR,
        error: error.message,
        conversationId: req.params.conversationId,
      });
    }
  }
}

export default SearchController;
