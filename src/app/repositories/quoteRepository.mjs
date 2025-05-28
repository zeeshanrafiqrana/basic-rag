import File from '../../models/fileModel.mjs';
import Quote from  '../../models/quoteModel.mjs';

class QuoteRepository {
    /**
     * Saves a file record in the database.
     * @param {Object} fileData - The file data to save.
     */
    static async saveFile({ originalName, path, mimetype }) {
        return await File.create({ originalName, path, mimetype });
    }
    /**
     * Retrieves a file by its ID.
     * @param {number} fileId - The ID of the file to retrieve.
     * @returns {Promise<File|null>} The file record or null if not found.
     */
    static async saveQuotes(fileId, quotes) {
        return await Quote.bulkCreate(
            quotes.map(q => ({
                fileId,
                originalText: q.originalText,
                cleanedText: q.cleanedText,
                speaker: q.speaker,
                position: q.position,
                status: q.status,
                category: q.classification?.category || null,
                subcategory: q.classification?.subcategory || null,
                confidence: q.classification?.confidence || null,
                embedding: q.embedding || null
            }))
        );
    }
}

export default QuoteRepository;
