import { AzureOpenAI } from 'openai';

const client = new AzureOpenAI({
  azure_endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_KEY,
  apiVersion: "2024-02-01"
});

class AzureOpenAIService {
  /**
   * Cleans a quote by removing filler words, fixing grammar, and clarifying meaning.
   * @param {string} quoteText - The quote text to clean.
   * @returns {Promise<string>} - The cleaned quote text.
   */
  static async cleanQuote(quoteText) {
    try {
      const response = await client.chat.completions.create({
        model: process.env.AZURE_OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a quote cleaning assistant. Remove filler words, fix grammar, and clarify meaning while preserving the original intent."
          },
          {
            role: "user",
            content: `Clean this quote: "${quoteText}"`
          }
        ],
        temperature: 0.3
      });

      const cleaned = response.choices[0].message.content.trim();

      if (
        cleaned.toLowerCase().includes("i'm sorry") ||
        cleaned.length < 10
      ) {
        return quoteText; 
      }

      return cleaned;

    } catch (error) {
      return quoteText;
    }
  }
  /**
   * Enhances a list of quotes by cleaning them and adding metadata.
   * @param {Array} quotes - The list of quotes to enhance.
   * @returns {Promise<Array>} - The enhanced quotes.
   */
  static async enhanceQuotes(quotes) {
    return Promise.all(
      quotes.map(async quote => ({
        ...quote,
        cleanedText: await this.cleanQuote(quote.text),
      }))
    );
  }
  /**
   * Enriches a quote with metadata such as key themes, sentiment, and action items.
   * @param {Object} quote - The quote to enrich.
   * @returns {Promise<Object>} - The enriched quote.
   */
  static async enrichQuote(quote) {
    const isCommand = /^[a-zA-Z0-9_\-./\\]+(\s+[a-zA-Z0-9_\-./\\]+)*$/.test(quote.originalText.trim());

    if (isCommand) {
      return {
        ...quote,
        cleanedText: quote.originalText,
        classification: {
          category: "Command",
          subcategory: "Command",
          confidence: 1.0
        }
      };
    }

    try {
      const response = await client.chat.completions.create({
        model: process.env.AZURE_OPENAI_MODEL,
        messages: [{
          role: "system",
          content: `Return JSON ONLY with these fields: 
          { 
            "category": string, 
            "subcategory": string, 
            "confidence": number 
          }`
        }, {
          role: "user",
          content: `Analyze: "${quote.cleanedText}"`
        }],
        response_format: { type: "json_object" },
        temperature: 0.1
      });

      const textResponse = response.choices[0].message.content;
      let parsed;

      try {
        parsed = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('Failed to parse JSON:', textResponse);
        throw new Error('Invalid JSON response from AI');
      }

      if (!parsed.category || typeof parsed.confidence !== "number") {
        throw new Error('Incomplete classification data');
      }

      return {
        ...quote,
        classification: parsed
      };

    } catch (error) {
      console.error('Quote enrichment failed:', error.message);
      return {
        ...quote,
        classification: { error: error.message }
      };
    }
  }


}

export default AzureOpenAIService;