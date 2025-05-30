import fs from 'fs/promises';
import mammoth from 'mammoth';
import xlsx from 'xlsx';
import PDFParser from 'pdf2json';
import { createWorker } from 'tesseract.js';

class UploadRepository {
  /**
   * Extracts text from an image using OCR
   * @param {string} filePath - Path to the image file
   * @returns {Promise<string>} - Extracted text
   */
  static async extractWithOCR(filePath) {
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data } = await worker.recognize(filePath);
    await worker.terminate();
    return data.text;
  }
  /**
   * Extracts text from a PDF file
   * @param {string} filePath - Path to the PDF file
   * @returns {Promise<string>} - Extracted text
   */
  static async extractTextFromPDF(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const pdfParser = new PDFParser(null, 1);

      return new Promise((resolve, reject) => {
        pdfParser.on('pdfParser_dataReady', () => {
          try {
            resolve(pdfParser.getRawTextContent() || '');
          } catch (e) {
            reject(e);
          }
        });
        pdfParser.on('pdfParser_dataError', reject);
        pdfParser.parseBuffer(dataBuffer);
      });
    } catch (error) {
      return this.extractWithOCR(filePath);
    }
  }
  /**
   * Extracts text from a Word document
   * @param {string} filePath - Path to the Word document
   * @returns {Promise<string>} - Extracted text
   */
  static async extractTextFromWord(filePath) {
    const { value } = await mammoth.extractRawText({ path: filePath });
    return value;
  }
  /**
   * Extracts text from an Excel file
   * @param {string} filePath - Path to the Excel file
   * @returns {Promise<string>} - Extracted text
   */
  static async extractTextFromExcel(filePath) {
    const workbook = xlsx.readFile(filePath);
    return workbook.SheetNames
      .map(sheet => xlsx.utils.sheet_to_csv(workbook.Sheets[sheet]))
      .join('\n\n');
  }
  /**
   * Extracts raw text from a file based on its type
   * @param {string} filePath - Path to the file
   * @param {string} mimeType - MIME type of the file
   * @returns {Promise<string>} - Extracted text
   */
  static async extractRawText(filePath, mimeType) {
    const extension = filePath.split('.').pop().toLowerCase();

    try {
      if (extension === 'pdf' || mimeType === 'application/pdf') {
        return await this.extractTextFromPDF(filePath);
      }

      if (extension === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return await this.extractTextFromWord(filePath);
      }

      if (
        ['xlsx', 'xls', 'csv'].includes(extension) ||
        ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'].includes(mimeType)
      ) {
        return await this.extractTextFromExcel(filePath);
      }

      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      console.error(`Failed to extract text from file ${filePath}:`, error);
      return `Error: Unable to extract text from file`;
    }
  }
}

export default UploadRepository;