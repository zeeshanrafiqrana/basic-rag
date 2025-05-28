import AzureOpenAIService from '../app/service/azureOpenAIService.mjs';
import QuoteSearchService from '../app/service/quoteSearchService.mjs';

class SearchController {
    /**
     * Document-specific question answering
     */
    static async askAboutFile(req, res) {
      try {
        const { query } = req.body;
        const { conversationId } = req.params; 
  
        if (!query || typeof query !== 'string') {
          return res.status(400).json({
            statusCode: 400,
            message: 'Query is required and must be a non-empty string.'
          });
        }
  
        const results = await QuoteSearchService.searchInFile(query, conversationId);
  
        return res.status(200).json({
          statusCode: 200,
          message: 'Analysis completed',
          query,
          conversationId,
          answer: results.answer,
          relevantSections: results.relevantSections,
          fullAnalysis: process.env.NODE_ENV === 'development' ? results.fullAnalysis : undefined
        });
  
      } catch (error) {
        console.error('File analysis error:', error.message);
        return res.status(500).json({
          statusCode: 500,
          message: 'Document analysis failed',
          error: error.message
        });
      }
    }
  }

export default SearchController;