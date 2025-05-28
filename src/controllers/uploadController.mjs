import { RESPONSE_MESSAGES, API_STATUS_CODES } from "../constant/apiStatus.mjs";
import UploadService from "../app/service/uploadService.mjs";
import AzureOpenAIService from "../app/service/azureOpenAIService.mjs";
import { unlink } from 'fs/promises'; 
import QuoteRepository from "../app/repositories/quoteRepository.mjs";


class UploadController {
    /**
     * Handles the upload of multiple documents and extracts text from each
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @returns {Promise<void>}
     */
    static async uploadDocsController(req, res) {
      try {
        const results = await Promise.all(
          req.files.map(async (file) => {
            try {
              const rawText = await UploadService.extractText(file.path, file.mimetype);
              const rawQuotes = await UploadService.processTranscript(rawText);
  
              const processedQuotes = await Promise.all(
                rawQuotes.map(async (quote) => {
                  try {
                    const enriched = await AzureOpenAIService.enrichQuote(quote);
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
                mimetype: file.mimetype
              });
              
              await QuoteRepository.saveQuotes(savedFile.id, processedQuotes);

              return {
                originalName: file.originalname,
                path: file.path,
                mimetype: file.mimetype,
                quotes: processedQuotes,
                stats: {
                  totalQuotes: processedQuotes.length,
                  successful: processedQuotes.filter(q => q.status === "success").length,
                  failed: processedQuotes.filter(q => q.status === "failed").length
                }
              };
            } catch (fileError) {
              console.error(`File processing error (${file.originalname}):`, fileError);
              return {
                originalName: file.originalname,
                error: fileError.message,
                success: false
              };
            } finally {
              try {
                await unlink(file.path);
              } catch (cleanupError) {
                console.error(`File cleanup failed (${file.path}):`, cleanupError.message);
              }
            }
          })
        );
  
        return res.status(API_STATUS_CODES.SUCCESS).json({
          statusCode: API_STATUS_CODES.SUCCESS,
          message: RESPONSE_MESSAGES.SUCCESS,
          data: results,
          meta: {
            totalFiles: req.files.length,
            successfulFiles: results.filter(r => r.success !== false).length,
            totalQuotes: results.reduce((sum, r) => sum + (r.stats?.totalQuotes || 0), 0)
          }
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
}

export default UploadController;