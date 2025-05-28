import { sequelize } from '../../db/connectionDB.mjs';

class QuoteSearchService {
  /**
   * Performs a semantic-like search using PostgreSQL full-text search.
   * @param {string} query - User input query string
   * @returns {Promise<Array>} List of ranked quote matches
   */
  static async searchQuotes(query) {
    if (!query || typeof query !== 'string') {
      throw new Error('Query must be a non-empty string.');
    }

    const tsQuery = query
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 1)
      .join(' & ');

    const results = await sequelize.query(
      `
      SELECT "Quotes".*, ts_rank(to_tsvector('english', "cleanedText"), to_tsquery('english', :tsQuery)) AS rank
      FROM "Quotes"
      WHERE to_tsvector('english', "cleanedText") @@ to_tsquery('english', :tsQuery)
      ORDER BY rank DESC
      LIMIT 10;
      `,
      {
        replacements: { tsQuery },
        type: sequelize.QueryTypes.SELECT
      }
    );

    return results;
  }
}

export default QuoteSearchService;
