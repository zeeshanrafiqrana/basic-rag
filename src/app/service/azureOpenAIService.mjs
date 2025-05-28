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
      quotes.map(async quote => {
        let cleaned = await this.cleanQuote(this.stripHeadersAndFooters(quote.originalText));
  
        if (!cleaned || cleaned.length < 10 || cleaned.toLowerCase().includes("i'm sorry")) {
          cleaned = quote.originalText;
        }
  
        return {
          ...quote,
          cleanedText: cleaned
        };
      })
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
          content: `Analyze: "${quote.cleanedText || quote.originalText}"`
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
  /**
   * Generates an embedding for the given text.
   * @param {string} text - The text to generate an embedding for.
   * @returns {Promise<Array>} - The embedding vector.
   */
  static async getEmbedding(text) {
    const response = await client.embeddings.create({
      model: "text-embedding-ada-002",
      input: text
    });
  
    return response.data[0].embedding;
  }
  /**
   * Generates a summary for the given text.
   * @param {string} text - The text to summarize.
   * @returns {Promise<string>} - The summary of the text.
   */
  static stripHeadersAndFooters(text) {
    return text
      .replace(/^Page \d+ of \d+/gim, '')
      .replace(/^CTAS.*?\n/gim, '')
      .replace(/^.*?(Dear Reader,)/is, '$1')
      .trim();
  }
  /**
   * Explains why a document is relevant to a query
   * @param {string} query - Search query
   * @param {string} documentText - Document content
   * @returns {Promise<string>} - Explanation text
   */
  static async explainRelevance(query, documentText) {
    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "Explain in 1-2 sentences why this document is relevant to the query."
        },
        {
          role: "user",
          content: `Query: "${query}"\n\nDocument:\n${documentText}`
        }
      ],
      temperature: 0.3
    });
    
    return response.choices[0].message.content.trim();
  }
  /**
   * Extracts key information from a document
   * @param {string} documentText - Document content
   * @returns {Promise<Object>} - Key information
   */
  static async extractKeyInfo(documentText) {
    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: `Extract key information as JSON: {
            "mainTopic": string,
            "keyPoints": string[],
            "actionItems": string[]
          }`
        },
        {
          role: "user",
          content: documentText
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1
    });
    
    try {
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Failed to parse key info:', error);
      return {
        mainTopic: '',
        keyPoints: [],
        actionItems: []
      };
    }
  }
  /**
   * Generates a concise summary answer based on search results
   * @param {string} query - The user's original query
   * @param {string} contextText - Combined text of relevant documents
   * @returns {Promise<string>} - Generated summary answer
   */
  static async generateSummaryAnswer(query, contextText) {
    try {
      const response = await client.chat.completions.create({
        model: process.env.AZURE_OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that provides concise answers based on provided documents.
            Rules:
            1. Answer ONLY using information from the provided context
            2. Be brief and to the point (1-2 paragraphs max)
            3. If unsure, say "Based on the documents, I found..."
            4. Never invent information`
          },
          {
            role: "user",
            content: `Question: ${query}\n\nRelevant Documents:\n${contextText}`
          }
        ],
        temperature: 0.3,
        max_tokens: 300
      });

      const answer = response.choices[0].message.content.trim();

      if (answer.toLowerCase().includes("i don't know") || 
          answer.toLowerCase().includes("i couldn't find") ||
          answer.length < 10) {
        return "I found some relevant documents but couldn't generate a concise summary. Please review the individual results.";
      }

      return answer;

    } catch (error) {
      console.error('Summary generation failed:', error);
      return "I couldn't generate a summary due to an error. Please review the individual results.";
    }
  }
}

export default AzureOpenAIService;