import UploadRepository from '../../app/repositories/uploadRepositry.mjs';
import AzureOpenAIService from './azureOpenAIService.mjs';

class UploadService {
  /**
   * Extracts raw text from a file
   * @param {string} filePath - Path to the file
   * @param {string} mimeType - MIME type of the file
   * @returns {Promise<string>} - Extracted text
   */
  static async extractText(filePath, mimeType) {
    try {
      return await UploadRepository.extractRawText(filePath, mimeType);
    } catch (error) {
      return error
    }
  }
  /**
   * Processes raw text into structured quotes
   * @param {string} rawText - Extracted text content
   * @returns {Array} - Array of quote objects
   */
  static async processTranscript(rawText) {
    const normalized = this.normalizeText(rawText);
    const rawQuotes = this.extractQuotes(normalized);
    const cleanedQuotes = await AzureOpenAIService.enhanceQuotes(rawQuotes);
  
    const enrichedQuotes = await Promise.all(
      cleanedQuotes.map(async quote => {
        const enriched = await AzureOpenAIService.enrichQuote(quote);
        return {
          ...quote,         
          ...enriched      
        };
      })
    );
  
    return enrichedQuotes;
  }
  
  /**
   * Normalizes the text by removing timestamps and extra spaces
   * @param {string} text - Text to normalize
   * @returns {string} - Normalized text
   */
  static normalizeText(text) {
    return text
      .replace(/\[\d{2}:\d{2}:\d{2}\]/g, '')
      .replace(/(Speaker \d+:)/g, '\n$1\n')
      .replace(/\s{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n');
  }
  /**
   * Extracts quotes from the text
   * @param {string} text - Text to extract quotes from
   * @returns {Array} - Array of quote objects
   */
  static extractQuotes(text) {
    const structuredQuotes = [];
    const quoteRegex = /(?:Agent|Speaker)\s*\w+:([^\n]+)/gi;
    let match;

    while ((match = quoteRegex.exec(text)) !== null) {
      structuredQuotes.push({
        originalText: match[1].trim(),
        speaker: match[0].split(':')[0].trim(),
        position: match.index
      });
    }

    if (structuredQuotes.length === 0) {
      return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map((line, index) => ({
          originalText: line,
          speaker: 'unknown',
          position: index
        }));
    }

    return structuredQuotes;
  }

}

export default UploadService;