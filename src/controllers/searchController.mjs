import QuoteSearchService from '../app/service/quoteSearchService.mjs';

class SearchController {
    /**
     * Handles search requests for quotes based on a user query.
     * @param {Object} req - The request object containing the search query.
     * @param {Object} res - The response object to send the results.
     * @returns {Promise<void>}
     */
    static async searchQuotes(req, res) {
        try {
            const { query } = req.body;

            if (!query || typeof query !== 'string') {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Query is required and must be a non-empty string.'
                });
            }

            const results = await QuoteSearchService.searchQuotes(query);

            return res.status(200).json({
                statusCode: 200,
                message: 'Search completed successfully.',
                query,
                results
            });

        } catch (error) {
            console.error('SearchController error:', error.message);
            return res.status(500).json({
                statusCode: 500,
                message: 'Search failed',
                error: error.message
            });
        }
    }
}

export default SearchController;
