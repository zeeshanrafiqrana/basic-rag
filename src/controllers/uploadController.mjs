import { RESPONSE_MESSAGES, API_STATUS_CODES } from "../constant/apiStatus.mjs";
import UploadService from "../app/service/uploadService.mjs";
import AzureOpenAIService from "../app/service/azureOpenAIService.mjs";
import { unlink } from 'fs/promises';
import QuoteRepository from "../app/repositories/quoteRepository.mjs";
import { v4 as uuidv4 } from 'uuid';

class UploadController {
  /**
   * Handles document upload and processing
   * @param {Object} req - Express request object containing files
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} - Response object with status and message
   */
  static async uploadDocsController(req, res) {
    try {
      const conversationId = uuidv4();

      UploadController.processFilesAsync(req.files, conversationId);
      return res.status(API_STATUS_CODES.SUCCESS).json({
        statusCode: API_STATUS_CODES.SUCCESS,
        message: RESPONSE_MESSAGES.SUCCESS,
        conversationId,
        note: "Documents are being processed in the background"
      });

    } catch (error) {
      console.error('Upload processing error:', error);
      return res.status(API_STATUS_CODES.ERROR_CODE).json({
        statusCode: API_STATUS_CODES.ERROR_CODE,
        message: RESPONSE_MESSAGES.PROCESSING_FAILED,
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  /**
   * Processes files in the background and associates them with the conversation ID
   * @param {Array} files - Array of file objects from the request
   * @param {string} conversationId - Unique ID for the conversation
   * @returns {Promise<void>}
   */
  static async processFilesAsync(files, conversationId) {
    try {
      await Promise.all(
        files.map(async (file) => {
          try {
            const rawText = await UploadService.extractText(file.path, file.mimetype);
            const rawQuotes = await UploadService.processTranscript(rawText);

            const processedQuotes = await Promise.all(
              rawQuotes.map(async (quote) => {
                try {
                  const enriched = await AzureOpenAIService.enrichQuote({
                    ...quote,
                    conversationId
                  });
                  return {
                    ...enriched,
                    status: enriched.classification?.error ? "failed" : "success"
                  };
                } catch (e) {
                  return {
                    ...quote,
                    classification: { error: e.message },
                    status: "failed"
                  };
                }
              })
            );

            const savedFile = await QuoteRepository.saveFile({
              originalName: file.originalname,
              path: file.path,
              mimetype: file.mimetype,
            });

            await QuoteRepository.saveQuotes(savedFile.id, processedQuotes, conversationId);

          } catch (fileError) {
            console.error(`File processing error (${file.originalname}):`, fileError);
          } finally {
            try {
              await unlink(file.path);
            } catch (cleanupError) {
              console.error(`File cleanup failed (${file.path}):`, cleanupError.message);
            }
          }
        })
      );
    } catch (error) {
      console.error('Background processing error:', error);
    }
  }
}

export default UploadController;